import type { LiteralUnion } from "type-fest"
import type { z } from "zod"
import type { FileRefSchema, PluginContextSchema } from "../schemas"

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
