# Schema 验证测试

本目录包含所有 Zod Schema 的边界条件测试，确保 Schema 验证逻辑的正确性和完整性。

## 测试文件

| 文件 | 说明 |
|------|------|
| `common.test.ts` | I18nEntrySchema 测试 |
| `definition.test.ts` | 各种 Definition Schema 测试（Base, Plugin, Credential, DataSource, Model, Tool） |
| `property.test.ts` | Property Schema 测试（String, Number, Boolean, Array, Object, DiscriminatedUnion, CredentialId, EncryptedString 等） |
| `property-ui.test.ts` | Property UI 组件 Schema 测试（各种 UI 组件类型和属性） |

## 测试覆盖范围

### `common.test.ts`

- I18nEntrySchema 验证：
  - 拒绝非对象值（字符串、数组、null、undefined、数字、布尔值）
  - 要求必须包含 `en_US` 键
  - 验证语言代码格式（`<语言代码>_<国家或脚本代码>`）
  - 验证所有值必须是字符串

### `definition.test.ts`

- BaseDefinitionSchema 验证：
  - 名称验证（长度、格式、特殊字符）
  - 必填字段验证
  - 可选字段验证
- PluginDefinitionSchema 验证：
  - 邮箱格式验证
  - URL 格式验证
  - 版本号验证
- ModelDefinitionSchema 验证：
  - 模型名称格式验证（支持 `/` 字符）
  - 模型类型验证
  - 输入/输出模态验证
  - 定价信息验证
- ToolDefinitionSchema 验证：
  - `invoke` 函数签名验证

### `property.test.ts`

- PropertyBaseSchema 验证：
  - 名称验证（空字符串、特殊字符、`$` 前缀、`.`、`[`、`]` 字符）
  - 显示条件验证
  - AI 配置验证
- 各种 Property 类型验证：
  - 常量值验证
  - 默认值验证
  - 枚举值验证
  - 范围验证（字符串长度、数字范围、数组大小）
  - 嵌套结构验证
  - 区分联合类型验证

### `property-ui.test.ts`

- PropertyUICommonPropsSchema 验证：
  - `indentation` 字段验证（2-80 之间的偶数）
  - 其他通用属性验证
- 各种 UI 组件 Schema 验证：
  - 组件类型验证
  - 组件特定属性验证
  - 类型联合验证

## 已解决的问题

### ✅ Zod `.pick()` 限制（已解决）

**问题描述：** 之前 `PropertyDiscriminatedUnionSchema` 的 `any_of` getter 使用 `.pick()` 方法作用于 `PropertyObjectSchema`，而后者包含 `.refine()` 调用。这是 Zod 的已知限制 - 无法在包含 refinements 的 schema 上使用 `.pick()`。

**解决方案：** `PropertyDiscriminatedUnionSchema` 的 `any_of` getter 现在直接使用 `z.array(PropertyObjectSchema)`，不再使用 `.pick()` 方法。

**状态：** ✅ 已修复，所有相关测试已启用。

### ✅ PropertyUIPropsSchema 问题（已解决）

**问题描述：** `PropertyUIPropsSchema` 之前使用 `discriminatedUnion("type", ...)` 但组件 schema 实际使用 `component` 字段作为区分器。

**解决方案：** `PropertyUIPropsSchema` 现在使用 `discriminatedUnion("component", ...)`，与实际的组件 schema 字段匹配。

**状态：** ✅ 已修复，所有相关测试已启用。

## 运行测试

```bash
bun test tests/schemas/
```

## 测试原则

1. **边界条件测试：** 重点测试 Schema 的边界条件和错误情况
2. **类型安全验证：** 确保 Schema 推断类型与 TypeScript 类型匹配
3. **完整覆盖：** 覆盖所有 Schema 的主要验证规则和边界情况
