import type { JsonObject, JsonValue } from "type-fest"
import type { I18nText, ResourceLocatorValue, ResourceMapperValue } from "./common"
import type {
  PropertyUIArray,
  PropertyUIBoolean,
  PropertyUICommonProps,
  PropertyUICredentialId,
  PropertyUIEncryptedString,
  PropertyUINumber,
  PropertyUIObject,
  PropertyUIRadioGroupProps,
  PropertyUISingleSelectProps,
  PropertyUIString,
  PropertyUISwitchProps,
} from "./property-ui"

/**
 * Condition for controlling property visibility based on sibling property values
 * @template TSchema - Parent schema containing all sibling properties
 */
export type DisplayCondition<TSchema extends JsonObject = JsonObject> =
  /**
   * Direct property conditions: supports nested paths (e.g., "address.city")
   */
  | {
      [P in keyof TSchema]?: Condition<TSchema[P]>
    }
  /**
   * Logical operators for combining multiple conditions
   */
  | RootFilter<TSchema>

/**
 * Root Filter Operators for group conditions
 */
interface RootFilter<TSchema extends JsonObject = JsonObject> {
  /**
   * Joins conditions with logical AND; all conditions must be true
   */
  $and?: Array<DisplayCondition<TSchema>> | null
  /**
   * Joins conditions with logical NOR; none of the conditions must be true
   */
  $nor?: Array<DisplayCondition<TSchema>> | null
  /**
   * Joins conditions with logical OR; at least one condition must be true
   */
  $or?: Array<DisplayCondition<TSchema>> | null
}

type Condition<T extends JsonValue = JsonValue> = T | FilterOperators<T>

/**
 * Filter Operators
 * reference: https://www.mongodb.com/docs/manual/reference/mql/query-predicates/
 */
export interface FilterOperators<TValue extends JsonValue = JsonValue> {
  /**
   * Matches values equal to a specified value
   */
  $eq?: TValue | null
  /**
   * Checks if a field exists
   */
  $exists?: boolean | null
  /**
   * Matches values greater than a specified value
   */
  $gt?: TValue | null
  /**
   * Matches values greater than or equal to a specified value
   */
  $gte?: TValue | null
  /**
   * Matches any value specified in an array
   */
  $in?: Array<TValue> | null
  /**
   * Matches values less than a specified value
   */
  $lt?: TValue | null
  /**
   * Matches values less than or equal to a specified value
   */
  $lte?: TValue | null
  /**
   * Matches values based on a modulo operation; value: [divisor, remainder]
   */
  $mod?: TValue extends number ? [number, number] | null : never
  /**
   * Matches values not equal to a specified value
   */
  $ne?: TValue | null
  /**
   * Matches values not in a specified array
   */
  $nin?: Array<TValue> | null
  /**
   * Regex options: i=case-insensitive, m=multiline, x=ignore whitespace, s=dotAll, u=unicode
   */
  $options?: TValue extends string ? string | null : never
  /**
   * Matches values against a regular expression pattern
   */
  $regex?: TValue extends string ? RegExp | string | null : never
  /**
   * Matches arrays with a specified number of elements
   */
  $size?: TValue extends Array<unknown> ? number | null : never
}

export interface PropertyBase<TName extends string = string> {
  /**
   * Unique property name within the same level
   */
  name: TName
  /**
   * Display name (supports i18n)
   */
  display_name?: I18nText | null
  /**
   * Whether this property is required
   */
  required?: boolean | null
  /**
   * Display condition; if not set, property is always visible
   */
  display?: {
    // display condition only evaluates sibling properties, not the property itself
    hide?: DisplayCondition | null
    show?: DisplayCondition | null
  } | null
  /**
   * AI-related configuration
   */
  ai?: {
    llm_description?: I18nText | null
  } | null
  /**
   * UI configuration for how the property is displayed
   */
  ui?: PropertyUICommonProps | null
  /**
   * Currently only supported by resource locator and resource mapper properties.
   *
   * Property types that can be depended on: string, number/integer, boolean, resource_locator.
   * Property types that can use `depends_on`: resource_locator, resource_mapper.
   */
  depends_on?: Array<string> | null
}

export interface PropertyString<TName extends string = string> extends PropertyBase<TName> {
  type: "string"
  /**
   * Restrict value to a single constant
   */
  constant?: string | null
  /**
   * Default value when not specified
   */
  default?: string | null
  /**
   * Restrict value to a set of allowed values
   */
  enum?: Array<string> | null
  /**
   * Maximum string length
   */
  max_length?: number | null
  /**
   * Minimum string length
   */
  min_length?: number | null
  ui?: PropertyUIString | null
}

export interface PropertyNumber<TName extends string = string> extends PropertyBase<TName> {
  type: "number" | "integer"
  /**
   * Restrict value to a single constant
   */
  constant?: number | null
  /**
   * Default value when not specified
   */
  default?: number | null
  /**
   * Restrict value to a set of allowed values
   */
  enum?: Array<number> | null
  /**
   * Maximum value (inclusive)
   */
  maximum?: number | null
  /**
   * Minimum value (inclusive)
   */
  minimum?: number | null
  ui?: PropertyUINumber | null
}

export interface PropertyBoolean<TName extends string = string> extends PropertyBase<TName> {
  type: "boolean"
  /**
   * Restrict value to a single constant
   */
  constant?: boolean | null
  /**
   * Default value when not specified
   */
  default?: boolean | null
  /**
   * Restrict value to a set of allowed values
   */
  enum?: Array<boolean> | null
  ui?: PropertyUIBoolean | null
}

/**
 * Object Property Type
 * @template TName - Type of the property name
 * @template TDiscriminator - When PropertyObject is used as a variant(any_of) in PropertyDiscriminatedUnion, this type represents the discriminator property name
 * @template TValue - real value type of the object property
 */
export interface PropertyObject<
  TName extends string = string,
  TDiscriminator extends string = string,
  TValue extends Record<string, JsonValue> = Record<string, JsonValue>,
> extends PropertyBase<TName> {
  type: "object"
  /**
   * Child properties of the object
   */
  properties: string extends TDiscriminator
    ? Array<
        Property<TValue extends Record<string, JsonValue> ? Exclude<keyof TValue, number> : string>
      >
    : // when discriminator is specified, ensure the discriminator property is the first property
      [
        Property<TDiscriminator> & { constant: TValue[TDiscriminator] },
        ...Array<
          Property<
            TValue extends Record<string, JsonValue> ? Exclude<keyof TValue, number> : string
          >
        >,
      ]
  /**
   * Restrict value to a single constant
   */
  constant?: TValue | null
  /**
   * Default value when not specified
   */
  default?: TValue | null
  /**
   * Restrict value to a set of allowed values
   */
  enum?: Array<TValue> | null
  /**
   * Schema for additional properties beyond those defined in `properties`.
   * Supports dynamic keys with values conforming to the specified property schema.
   * Semantics similar to JSON Schema's additionalProperties: https://json-schema.org/draft/2019-09/draft-handrews-json-schema-02#additionalProperties
   */
  additional_properties?: Property | PropertyDiscriminatedUnion<string> | null
  ui?: PropertyUIObject | null
}

export interface PropertyDiscriminatedUnion<TDiscriminator extends string = string> {
  type: "discriminated_union"
  /**
   * Possible object types in the array.
   */
  any_of: Array<PropertyObject<string, TDiscriminator>>
  /**
   * Property name used to discriminate between types
   */
  discriminator: TDiscriminator
  /**
   * UI component for displaying the discriminator field
   */
  discriminator_ui?:
    | PropertyUISwitchProps
    | PropertyUISingleSelectProps
    | PropertyUIRadioGroupProps
    | null
}

export interface PropertyArray<TName extends string = string> extends PropertyBase<TName> {
  type: "array"
  constant?: Array<JsonValue> | null
  default?: Array<JsonValue> | null
  enum?: Array<Array<JsonValue>> | null
  /**
   * Item schema for array elements
   */
  items: Property | PropertyDiscriminatedUnion<string>
  /**
   * Maximum array size (inclusive)
   */
  max_items?: number | null
  /**
   * Minimum array size (inclusive)
   */
  min_items?: number | null
  ui?: PropertyUIArray | null
}

export interface PropertyCredentialId<TName extends string = string> extends PropertyBase<TName> {
  type: "credential_id"
  /**
   * This field is used to map to the credential name defined in the plugin.
   *
   * **Note:** The name must match exactly, otherwise the system will be unable to find the corresponding credential.
   */
  credential_name: string
  ui?: PropertyUICredentialId | null // the ui component for selecting the credential
  constant?: null
  default?: null
  enum?: null
}

export interface PropertyEncryptedString<TName extends string = string>
  extends PropertyBase<TName> {
  type: "encrypted_string"
  ui?: PropertyUIEncryptedString | null
  constant?: null
  default?: null
  enum?: null
}

export type ResourceLocatorMode =
  | {
      type: "list"
      display_name?: I18nText | null
      placeholder?: I18nText | null
      search_list_method: string
      searchable?: boolean | null
    }
  | {
      type: "url"
      display_name?: I18nText | null
      placeholder?: I18nText | null
      extract_value: {
        type: "regex"
        regex: string
      }
    }
  | {
      type: "id"
      display_name?: I18nText | null
      placeholder?: I18nText | null
    }

export interface PropertyResourceLocator<TName extends string = string>
  extends PropertyBase<TName> {
  type: "resource_locator"
  default?: ResourceLocatorValue | null
  modes: Array<ResourceLocatorMode>
}

export interface ResourceMapperSchemaField {
  id: string
  display_name?: I18nText | null
  type: "string" | "number" | "boolean" | "object" | "array" | "integer"
  required?: boolean | null
}

export interface PropertyResourceMapper<TName extends string = string> extends PropertyBase<TName> {
  type: "resource_mapper"
  mapping_method: string
  default?: ResourceMapperValue | null
}

export interface PropertyFileReference<TName extends string = string> extends PropertyBase<TName> {
  type: "file_ref"
}

export type PropertyScalar<TName extends string = string> =
  | PropertyString<TName>
  | PropertyBoolean<TName>
  | PropertyNumber<TName>
  | PropertyEncryptedString<TName>

export type Property<TName extends string = string, TValue extends JsonValue = JsonValue> =
  | PropertyScalar<TName>
  | PropertyCredentialId<TName>
  | PropertyResourceLocator<TName>
  | PropertyResourceMapper<TName>
  | PropertyArray<TName>
  | PropertyObject<TName, string, TValue extends JsonObject ? TValue : JsonObject>
  | PropertyFileReference<TName>
