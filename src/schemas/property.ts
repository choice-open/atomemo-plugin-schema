import type { IsEqual, JsonValue } from "type-fest"
import { z } from "zod"
import type {
  DisplayCondition,
  FilterOperators,
  Property,
  PropertyArray,
  PropertyBase,
  PropertyBoolean,
  PropertyCredentialId,
  PropertyDiscriminatedUnion,
  PropertyEncryptedString,
  PropertyNumber,
  PropertyObject,
  PropertyScalar,
  PropertyString,
} from "../types"
import { compact } from "../utils/toolkit"
import { I18nEntrySchema } from "./common"
import {
  PropertyUIArraySchema,
  PropertyUIBooleanSchema,
  PropertyUICommonPropsSchema,
  PropertyUICredentialIdSchema,
  PropertyUIDiscriminatorUISchema,
  PropertyUIEncryptedStringSchema,
  PropertyUINumberSchema,
  PropertyUIObjectSchema,
  PropertyUIStringSchema,
} from "./property-ui"

const JsonPrimitiveSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([JsonPrimitiveSchema, z.array(JsonValueSchema), z.record(z.string(), JsonValueSchema)]),
)

const FilterOperatorsSchema = z.object({
  $eq: JsonValueSchema.nullish(),
  $exists: z.boolean().nullish(),
  $gt: JsonValueSchema.nullish(),
  $gte: JsonValueSchema.nullish(),
  $in: z.array(JsonValueSchema).nullish(),
  $lt: JsonValueSchema.nullish(),
  $lte: JsonValueSchema.nullish(),
  $mod: z.tuple([z.number(), z.number()]).nullish(),
  $ne: JsonValueSchema.nullish(),
  $nin: z.array(JsonValueSchema).nullish(),
  $options: z.string().nullish(),
  $regex: z.union([z.string(), z.instanceof(RegExp)]).nullish(),
  $size: z.number().nullish(),
})

const ConditionSchema = z.union([JsonValueSchema, FilterOperatorsSchema])

const RootFilterSchema = z.object({
  get $and() {
    return z.array(FilterSchema).nullish()
  },
  get $nor() {
    return z.array(FilterSchema).nullish()
  },
  get $or() {
    return z.array(FilterSchema).nullish()
  },
})
{
  const _: IsEqual<z.infer<typeof FilterOperatorsSchema>, FilterOperators> = true
}

// skip infer because of recursive structure
const FilterSchema: z.ZodType<DisplayCondition> = z.union([
  z.record(z.string(), ConditionSchema),
  RootFilterSchema,
])

const PropertyBaseSchema = z.object({
  name: z
    .string()
    .min(1, "name cannot be empty")
    .refine(
      (val) => {
        const regexStartsWithDollarOrWhitespace = /^[\s$]/
        return !regexStartsWithDollarOrWhitespace.test(val)
      },
      {
        error: "name cannot start with $ or whitespace",
        abort: true,
      },
    )
    .refine(
      (val) => {
        const forbiddenCharacters = [".", "[", "]"]
        return !forbiddenCharacters.some((char) => val.includes(char))
      },
      {
        error: 'name cannot contain ".", "[", or "]" characters',
        abort: true,
      },
    ),

  display_name: I18nEntrySchema.nullish(),
  required: z.boolean().nullish(),
  display: z
    .object({
      hide: FilterSchema.nullish(),
      show: FilterSchema.nullish(),
    })
    .nullish(),
  ai: z
    .object({
      llm_description: I18nEntrySchema.nullish(),
    })
    .nullish(),
  ui: PropertyUICommonPropsSchema.nullish(),
})
{
  const _: IsEqual<z.infer<typeof PropertyBaseSchema>, PropertyBase<string>> = true
}

const PropertyStringSchema = PropertyBaseSchema.extend({
  type: z.literal("string"),
  constant: z.string().nullish(),
  default: z.string().nullish(),
  enum: z.array(z.string()).nullish(),
  max_length: z.number().nullish(),
  min_length: z.number().nullish(),
  ui: PropertyUIStringSchema.nullish(),
})
{
  const _: IsEqual<z.infer<typeof PropertyStringSchema>, PropertyString<string>> = true
}

const PropertyNumberSchema = PropertyBaseSchema.extend({
  type: z.union([z.literal("number"), z.literal("integer")]),
  constant: z.number().nullish(),
  default: z.number().nullish(),
  enum: z.array(z.number()).nullish(),
  maximum: z.number().nullish(),
  minimum: z.number().nullish(),
  ui: PropertyUINumberSchema.nullish(),
})
{
  const _: IsEqual<z.infer<typeof PropertyNumberSchema>, PropertyNumber<string>> = true
}

const PropertyBooleanSchema = PropertyBaseSchema.extend({
  type: z.literal("boolean"),
  constant: z.boolean().nullish(),
  default: z.boolean().nullish(),
  enum: z.array(z.boolean()).nullish(),
  ui: PropertyUIBooleanSchema.nullish(),
})
{
  const _: IsEqual<z.infer<typeof PropertyBooleanSchema>, PropertyBoolean<string>> = true
}

const checkDuplicateNames = {
  checkFn: (properties: { name: string }[]) => {
    const names = new Set<string>()
    for (const prop of properties) {
      if (names.has(prop.name)) return false
      names.add(prop.name)
    }
    return true
  },
  customError: {
    error: "duplicate property names are not allowed",
  } as const,
}

// use type assertion and lazy to avoid circular reference error
const ArrayPropertiesSchema: z.ZodType<PropertyObject["properties"]> = z.lazy(() =>
  z.array(PropertySchema).refine(checkDuplicateNames.checkFn, checkDuplicateNames.customError),
)

const additionalPropertiesSchema: z.ZodType<Property> = z.lazy(() => PropertySchema)

const PropertyObjectSchema = PropertyBaseSchema.extend({
  type: z.literal("object"),
  properties: ArrayPropertiesSchema,
  additional_properties: additionalPropertiesSchema.nullish(),
  constant: z.record(z.string(), JsonValueSchema).nullish(),
  default: z.record(z.string(), JsonValueSchema).nullish(),
  enum: z.array(z.record(z.string(), JsonValueSchema)).nullish(),
  ui: PropertyUIObjectSchema.nullish(),
}).refine(
  (v) => {
    if (v.constant) return v.properties.length === 0
    return true
  },
  {
    error: "properties must be empty when constant is defined",
    abort: true,
  },
)
{
  type PropertyObjectInferred = z.infer<typeof PropertyObjectSchema>
  const _: IsEqual<PropertyObjectInferred, PropertyObject> = true
}

const PropertyDiscriminatedUnionSchema = PropertyBaseSchema.extend({
  type: z.literal("discriminated_union"),
  get any_of() {
    return z.array(PropertyObjectSchema).min(2, "anyOf must have at least two items")
  },
  discriminator: z.string().min(1, "discriminator cannot be empty"),
  discriminator_ui: PropertyUIDiscriminatorUISchema.nullish(),
})
  .refine(
    (v) => {
      const { any_of, discriminator } = v
      return any_of.every((i) => {
        const discriminatorProperty = i.properties?.find((p) => p.name === discriminator)
        if (!discriminatorProperty) return false
        if (!("constant" in discriminatorProperty)) return false
        if (
          typeof discriminatorProperty.constant !== "string" &&
          typeof discriminatorProperty.constant !== "number" &&
          typeof discriminatorProperty.constant !== "boolean"
        ) {
          return false
        }
        return true
      })
    },
    {
      error:
        "Each item in anyOf must contain the discriminator field with constant string/number/boolean value",
      abort: true,
    },
  )
  .refine(
    (v) => {
      const { any_of } = v
      const allDiscriminatorProperty = compact(
        any_of.map((i) => {
          const discriminatorProperty = i.properties?.find((p) => p.name === v.discriminator)
          if (!discriminatorProperty) return null
          if (!("constant" in discriminatorProperty)) return null
          return discriminatorProperty.constant
        }),
      )
      const uniqueValues = new Set(allDiscriminatorProperty)
      return uniqueValues.size === allDiscriminatorProperty.length
    },
    {
      error: "Discriminator values must be unique across all anyOf items",
    },
  )
{
  const _: IsEqual<
    z.infer<typeof PropertyDiscriminatedUnionSchema>,
    PropertyDiscriminatedUnion
  > = true
}

const PropertyArraySchema = PropertyBaseSchema.extend({
  type: z.literal("array"),
  constant: z.array(JsonValueSchema).nullish(),
  default: z.array(JsonValueSchema).nullish(),
  enum: z.array(z.array(JsonValueSchema)).nullish(),
  get items() {
    return PropertySchema
  },
  max_items: z.number().nullish(),
  min_items: z.number().nullish(),
  ui: PropertyUIArraySchema.nullish(),
})
{
  const _: IsEqual<z.infer<typeof PropertyArraySchema>, PropertyArray> = true
}

const PropertyCredentialIdSchema = PropertyBaseSchema.extend({
  type: z.literal("credential_id"),
  credential_name: z.string().min(1, "credential_name cannot be empty"),
  ui: PropertyUICredentialIdSchema.nullish(),
})

{
  const _: IsEqual<z.infer<typeof PropertyCredentialIdSchema>, PropertyCredentialId<string>> = true
}
const PropertyEncryptedStringSchema = PropertyBaseSchema.extend({
  type: z.literal("encrypted_string"),
  ui: PropertyUIEncryptedStringSchema.nullish(),
})
{
  const _: IsEqual<z.infer<typeof PropertyEncryptedStringSchema>, PropertyEncryptedString> = true
}

const PropertyScalarSchema = z.union([
  PropertyStringSchema,
  PropertyBooleanSchema,
  PropertyNumberSchema,
  PropertyEncryptedStringSchema,
])
{
  const _: IsEqual<z.infer<typeof PropertyScalarSchema>, PropertyScalar<string>> = true
}

export const PropertiesScalarSchema = z.lazy(() =>
  z
    .array(PropertyScalarSchema)
    .refine(checkDuplicateNames.checkFn, checkDuplicateNames.customError),
)

const PropertySchema = z.union([
  ...PropertyScalarSchema.options,
  PropertyCredentialIdSchema,
  PropertyArraySchema,
  PropertyObjectSchema,
  PropertyDiscriminatedUnionSchema,
])
{
  const _: IsEqual<z.infer<typeof PropertySchema>, Property> = true
}

export const PropertiesSchema = ArrayPropertiesSchema
