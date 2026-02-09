import type { IsEqual } from "type-fest"
import { z } from "zod"
import type {
  BaseDefinition,
  CredentialDefinition,
  ModelDefinition,
  PluginDefinition,
  ToolDefinition,
} from "../types"
import { JsonValueSchema } from "../utils/custom-json-value"
import { I18nEntrySchema } from "./common"
import { PropertiesScalarSchema, PropertiesSchema } from "./property"

/**
 * Base Definition Schema
 *
 * This is the base class for all function definition schemas, defining common properties and not used independently
 */
export const BaseDefinitionSchema = z.object({
  // 1. Can only contain English letters (case insensitive), numbers, _ and -
  // 2. Must start with an English letter and cannot end with _ or -
  // 3. _ and - cannot appear consecutively more than once
  // 4. Minimum length 4, maximum length 64
  name: z.string().regex(/^[a-zA-Z](?:(?![_-]{2,})[a-zA-Z0-9_-]){3,63}[a-zA-Z0-9]$/, {
    error:
      "Invalid name, should match the following rules: 1. only English letters, numbers, _ and - 2. start with English letter, end with English letter or number 3. _ and - cannot appear consecutively more than twice 4. minimum length 4, maximum length 64",
  }),
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

export const CredentialDefinitionSchema = z.object({
  ...BaseDefinitionSchema.shape,
  authenticate: z.function({
    input: z.tuple([
      z.object({
        args: z.object({
          parameters: z.looseObject({
            model: z.string().optional(),
          }),
          credentials: z.record(z.string(), z.string()),
        }),
      }),
    ]),
    output: z.promise(
      z.object({
        adapter: z.enum(["anthropic", "openai", "google", "deepseek"]),
        endpoint: z.httpUrl().optional(),
        model: z.string(),
        headers: z.record(z.string(), z.string()).optional(),
      }),
    ),
  }),
  parameters: PropertiesScalarSchema,
})
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
  name: z.string().regex(/^[a-zA-Z](?:(?![_-]{2,})[a-zA-Z0-9_/-]){3,63}[a-zA-Z0-9]$/, {
    error:
      "Invalid model name, should match the following rules: 1. only English letters, numbers, _ and - 2. start with English letter, end with English letter or number 3. _ and - cannot appear consecutively more than twice 4. minimum length 4, maximum length 64 5. allow '/' in the middle",
  }),
  model_type: z.literal("llm"),
  default_endpoint: z.httpUrl().optional(),
  input_modalities: z.array(z.enum(["file", "image", "text"])),
  output_modalities: z.array(z.enum(["text"])),
  pricing: z
    .object({
      currency: z.string().optional(),
      input: z.number().optional(),
      input_cache_read: z.number().optional(),
      input_cache_write: z.number().optional(),
      output: z.number().optional(),
      request: z.number().optional(),
    })
    .optional(),
  override_parameters: z
    .object({
      temperature: z
        .object({
          default: z.number().optional(),
          maximum: z.number().optional(),
          minimum: z.number().optional(),
        })
        .optional(),
      frequency_penalty: z
        .object({
          default: z.number().optional(),
          maximum: z.number().optional(),
          minimum: z.number().optional(),
        })
        .optional(),
      max_tokens: z
        .object({
          default: z.number().optional(),
          maximum: z.number().optional(),
        })
        .optional(),
      verbosity: z
        .object({
          default: z.enum(["low", "medium", "high"]).optional(),
        })
        .optional(),
    })
    .optional(),
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

export const ToolDefinitionSchema = z.object({
  ...BaseDefinitionSchema.shape,
  invoke: z.function({
    input: z.tuple([
      z.object({
        args: z.object({
          parameters: z.record(z.string(), z.any()),
          credentials: z.record(z.string(), z.string()).optional(),
        }),
      }),
    ]),
    output: z.promise(JsonValueSchema),
  }),
  parameters: PropertiesSchema,
})
{
  const _: IsEqual<z.infer<typeof ToolDefinitionSchema>, ToolDefinition> = true
}
