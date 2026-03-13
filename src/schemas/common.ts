import type { IsEqual } from "type-fest"
import { z } from "zod"
import type { I18nText } from "../types"
import { isPlainObject } from "../utils/toolkit"

/**
 * I18n 词条模式
 *
 * NOTE: Zod 无法定义复杂的字面量模版，此处使用 `z.custom` 实现自定义验证
 */
export const I18nEntrySchema = z.custom<I18nText>((value) => {
  // 必须是对象字面量
  if (!isPlainObject(value)) return false
  // 必须包含 en_US 键
  if (!("en_US" in value)) return false

  for (const [locale, text] of Object.entries(value)) {
    // 值必须是字符串
    if (typeof text !== "string") return false

    // NOTE: 支持的语言码并不严格符合标准，因为 TS 字面量模版无法描述所有可能的情况
    //       故以下仅对满足需求的子集做简单检查而不是严格的 RFC 5646 标准检查
    const parts = locale.split("_")
    // 其它语言代码必须符合格式：<语言代码>_<国家或脚本代码>，且第二部份首字母必须大写
    if (parts.length !== 2 || parts[1][0] !== parts[1][0].toUpperCase()) {
      return false
    }
  }
  return true
}, "Invalid I18n entry")
{
  const _: IsEqual<z.infer<typeof I18nEntrySchema>, I18nText> = true
}

// All fields are nullable because `undefined` is not a valid JSON value,
// and `FileRefSchema` instances may be returned from tool invocations.
export const FileRefSchema = z.object({
  __type__: z.literal("file_ref"),
  source: z.enum(["mem", "oss"]),
  filename: z.string().nullable(),
  extension: z.string().nullable(),
  mime_type: z.string().nullable(),
  size: z.number().nullable(),
  res_key: z.string().nullable(),
  remote_url: z.string().nullable(),
  content: z.base64().nullable(),
})

const _PluginContextSchema = z.object({
  files: z.object({
    attachRemoteUrl: z.function({
      input: z.tuple([FileRefSchema]),
      output: z.promise(
        FileRefSchema.extend({
          remote_url: z.string(),
        }),
      ),
    }),
    download: z.function({
      input: z.tuple([FileRefSchema]),
      output: z.promise(FileRefSchema),
    }),
    upload: z.function({
      input: z.tuple([FileRefSchema, z.looseObject({ prefixKey: z.string().nullish() })]),
      output: z.promise(FileRefSchema),
    }),
    parseFileRef: z.function({
      input: z.tuple([z.unknown()]),
      output: FileRefSchema,
    }),
  }),
})

// 这里不能直接导出 `_PluginContextSchema`：它内部包含 `z.function()`，直接参与其它
// `z.function()` 的参数推断时会暴露 inner input 类型，导致 `z.infer` 出来的
// `PluginContext` 与函数参数位类型不完全相等。用 `z.custom` 包一层可以保留相同运行时校验，
// 同时把静态类型固定为 `z.infer<typeof _PluginContextSchema>`。
export const PluginContextSchema = z.custom<z.infer<typeof _PluginContextSchema>>(
  (value) => _PluginContextSchema.safeParse(value).success,
)

/**
 * Name Schema
 *
 * 1. Can only contain English letters (case insensitive), numbers, _ and -
 * 2. Must start with an English letter and cannot end with _ or -
 * 3. _ and - cannot appear consecutively more than once
 * 4. Minimum length 4, maximum length 64
 */
export const nameSchema = z
  .string()
  .regex(/^[a-zA-Z](?:(?![_-]{2,})[a-zA-Z0-9_-]){3,63}[a-zA-Z0-9]$/, {
    error:
      "Invalid name, should match the following rules: 1. only English letters, numbers, _ and - 2. start with English letter, end with English letter or number 3. _ and - cannot appear consecutively more than twice 4. minimum length 4, maximum length 64",
  })
