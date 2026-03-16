import type { IsEqual } from "type-fest"
import { z } from "zod"
import type {
  BaseDefinition,
  CredentialDefinition,
  CredentialInputArgsCredential,
  ModelDefinition,
  PluginDefinition,
  ToolDefinition,
} from "../types"
import { JsonValueSchema } from "../utils/custom-json-value"
import { I18nEntrySchema, nameSchema, PluginContextSchema } from "./common"
import { PropertiesScalarSchema, PropertiesSchema } from "./property"

/**
 * Base Definition Schema
 *
 * This is the base class for all function definition schemas, defining common properties and not used independently
 */
export const BaseDefinitionSchema = z.object({
  name: nameSchema,
  display_name: I18nEntrySchema,
  description: I18nEntrySchema,
  icon: z.string(),
})
{
  const _: IsEqual<z.infer<typeof BaseDefinitionSchema>, BaseDefinition> = true
}

export const PluginDefinitionSchema = z.object({
  ...BaseDefinitionSchema.shape,
  author: z.string().nullish(),
  email: z.email().nullish(),
  repo: z.httpUrl().nullish(),
  version: z.string().nullish(),
  locales: z.array(z.string()),
  lang: z.enum(["elixir", "typescript"]),
})
{
  const _: IsEqual<
    z.infer<typeof PluginDefinitionSchema>,
    Omit<PluginDefinition<string[], unknown>, "transporterOptions"> // not necessary to verify transpoterOptions
  > = true
}

const CredentialInputArgsCredentialSchema = z.record(
  z.string(),
  z.string().or(z.number()).or(z.boolean()).nullish(),
)
{
  const _: IsEqual<
    z.infer<typeof CredentialInputArgsCredentialSchema>,
    CredentialInputArgsCredential
  > = true
}

const CredentialAuthenticateSchema = z.function({
  input: z.tuple([
    z.object({
      args: z.object({
        credential: CredentialInputArgsCredentialSchema,
        extra: z
          .looseObject({
            model: z.string().optional(),
          })
          .optional(),
      }),
      context: PluginContextSchema,
    }),
  ]),
  output: z.promise(
    z.looseObject({
      adapter: z.enum(["anthropic", "openai", "google_ai", "deepseek"]),
      api_key: z.string(),
      endpoint: z.httpUrl().optional(),
      model: z.string().optional(),
      headers: z.record(z.string(), z.string()).optional(),
    }),
  ),
})

const OAuth2BuildAuthorizeUrlSchema = z.function({
  input: z.tuple([
    z.object({
      args: z.object({
        credential: CredentialInputArgsCredentialSchema,

        redirect_uri: z.string(),
        state: z.string(),
      }),
      context: PluginContextSchema,
    }),
  ]),
  output: z.promise(z.object({ url: z.string() })),
})

const OAuth2GetTokenSchema = z.function({
  input: z.tuple([
    z.object({
      args: z.object({
        credential: CredentialInputArgsCredentialSchema,
        code: z.string(),
        redirect_uri: z.string(),
      }),
      context: PluginContextSchema,
    }),
  ]),
  output: z.promise(
    z.object({
      parameters_patch: z
        .object({
          access_token: z.string(),
          refresh_token: z.string(),
          expires_at: z.number().nullish(),
        })
        .catchall(z.unknown()),
    }),
  ),
})

const OAuth2RefreshTokenSchema = z.function({
  input: z.tuple([
    z.object({
      args: z.object({
        credential: CredentialInputArgsCredentialSchema,
      }),
      context: PluginContextSchema,
    }),
  ]),
  output: z.promise(
    z.object({
      parameters_patch: z
        .object({
          access_token: z.string(),
          expires_at: z.number().nullish(),
        })
        .catchall(z.unknown()),
    }),
  ),
})

const OAuth2RequiredParametersSpec = [
  {
    name: "client_id",
    type: "string",
    required: true,
  },
  {
    name: "client_secret",
    type: "encrypted_string",
    required: true,
  },
  {
    name: "access_token",
    type: "encrypted_string",
  },
  {
    name: "refresh_token",
    type: "encrypted_string",
  },
  {
    name: "expires_at",
    type: "integer",
  },
] as const

export const CredentialDefinitionSchema = z
  .object({
    ...BaseDefinitionSchema.shape,
    authenticate: CredentialAuthenticateSchema.optional(),
    oauth2: z.boolean().optional(),
    oauth2_build_authorize_url: OAuth2BuildAuthorizeUrlSchema.optional(),
    oauth2_get_token: OAuth2GetTokenSchema.optional(),
    oauth2_refresh_token: OAuth2RefreshTokenSchema.optional(),
    parameters: PropertiesScalarSchema,
  })
  // check oauth2 required parameters
  .refine(
    (value) => {
      if (!value.oauth2) return true
      const parameters = value.parameters ?? []
      return OAuth2RequiredParametersSpec.every((spec) => {
        const param = parameters.find((param) => param.name === spec.name)
        if (!param) return false
        // check required
        if ("required" in spec && param.required !== spec.required) return false
        // check type
        if ("type" in spec && param.type !== spec.type) return false
        return true
      })
    },
    {
      path: ["parameters"],
      message:
        "When oauth2 is true, parameters must include: client_id (required string), client_secret (required encrypted_string), access_token (encrypted_string), refresh_token (encrypted_string), and expires_at (integer).",
    },
  )
{
  const _: IsEqual<z.infer<typeof CredentialDefinitionSchema>, CredentialDefinition> = true
}

export const DataSourceDefinitionSchema = z.object({
  ...BaseDefinitionSchema.shape,
  parameters: PropertiesScalarSchema,
})

export type DataSourceDefinition = z.infer<typeof DataSourceDefinitionSchema>

export const ModelDefinitionSchema = z.object({
  ...BaseDefinitionSchema.shape,
  name: z.string().regex(/^[a-zA-Z](?:(?![_.-]{2,})[a-zA-Z0-9._/-])*[a-zA-Z0-9]$/, {
    error:
      "Invalid model name, should match the following rules: 1. only English letters, numbers, _, - and . 2. start with English letter, end with English letter or number 3. _, - and . cannot appear consecutively more than twice 4. allow '/' in the middle",
  }),
  model_type: z.literal("llm"),
  default_endpoint: z.httpUrl().nullish(),
  input_modalities: z.array(z.enum(["file", "image", "text"])),
  output_modalities: z.array(z.enum(["text"])),
  pricing: z
    .object({
      currency: z.string().nullish(),
      input: z.number().nullish(),
      input_cache_read: z.number().nullish(),
      input_cache_write: z.number().nullish(),
      output: z.number().nullish(),
      request: z.number().nullish(),
    })
    .nullish(),
  override_parameters: z
    .object({
      temperature: z
        .object({
          default: z.number().nullish(),
          maximum: z.number().nullish(),
          minimum: z.number().nullish(),
        })
        .nullish(),
      frequency_penalty: z
        .object({
          default: z.number().nullish(),
          maximum: z.number().nullish(),
          minimum: z.number().nullish(),
        })
        .nullish(),
      max_tokens: z
        .object({
          default: z.number().nullish(),
          maximum: z.number().nullish(),
        })
        .nullish(),
      verbosity: z
        .object({
          default: z.enum(["low", "medium", "high"]).nullish(),
        })
        .nullish(),
    })
    .nullish(),
  unsupported_parameters: z.array(
    z.enum([
      "endpoint",
      "temperature",
      // "top_p",
      // "top_k",
      "frequency_penalty",
      // "presence_penalty",
      // "repetition_penalty",
      // "min_p",
      // "top_a",
      "seed",
      "max_tokens",
      // "logit_bias",
      // "logprobs",
      // "top_logprobs",
      // "response_format",
      // "json_response",
      "json_schema",
      "stream",
      "stream_options",
      "structured_outputs",
      // "stop",
      // "tools",
      // "tool_choice",
      "parallel_tool_calls",
      "verbosity",
    ]),
  ),
})
{
  const _: IsEqual<z.infer<typeof ModelDefinitionSchema>, ModelDefinition> = true
}

const ToolInvokeFunctionSchema = z.function({
  input: z.tuple([
    z.object({
      args: z.object({
        parameters: z.record(z.string(), z.any()),
        credentials: z.record(z.string(), z.record(z.string(), z.any())).optional(),
      }),
      context: PluginContextSchema,
    }),
  ]),
  output: z.promise(JsonValueSchema),
})

export const ToolDefinitionSchema = z.object({
  ...BaseDefinitionSchema.shape,
  invoke: ToolInvokeFunctionSchema,
  parameters: PropertiesSchema,
  skill: z.string().nullish(),
})
{
  const _: IsEqual<z.infer<typeof ToolDefinitionSchema>, ToolDefinition> = true
}
