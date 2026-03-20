import type { IsEqual, LiteralUnion } from "type-fest"
import type { z } from "zod"
import type {
  FileRefSchema,
  PluginContextSchema,
  ResourceLocatorValueSchema,
  ResourceMapperValueSchema,
} from "../schemas"

/**
 * I18n Entry
 */
export interface I18nText {
  /**
   * English is required
   */
  en_US: string
  [locale: `${LiteralUnion<"zh_Hans", string>}_${string}`]: string | undefined
}

export type FileRef = z.infer<typeof FileRefSchema>

export type PluginContext = z.infer<typeof PluginContextSchema>

export type ResourceLocatorValue = {
  __type__: "resource_locator"
  mode_name: "list" | "url" | "id"
  value: string | null
  /**
   * only used when mode_name is "list"
   */
  cached_result_label?: string | null | undefined
  /**
   * only used when mode_name is "list"
   */
  cached_result_url?: string | null | undefined
}
{
  const _: IsEqual<z.infer<typeof ResourceLocatorValueSchema>, ResourceLocatorValue> = true
}

export type ResourceMapperValue = {
  __type__: "resource_mapper"
  mapping_mode: "manual" | "auto"
  value: string | Record<string, unknown> | null
}
{
  const _: IsEqual<z.infer<typeof ResourceMapperValueSchema>, ResourceMapperValue> = true
}
