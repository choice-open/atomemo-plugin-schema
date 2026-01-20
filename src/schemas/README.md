# schemas 目录

Zod Schema 验证模块。提供所有插件的运行时验证 Schema，与 `types/` 目录中的 TypeScript 类型一一对应。

## 模块说明

### `common.ts`

通用 Schema 定义。

**Schema：**

- `I18nEntrySchema`：国际化词条验证 Schema
  - 必须是对象字面量
  - 必须包含 `en_US` 键
  - 所有值必须是字符串
  - 语言代码格式：`<语言代码>_<国家或脚本代码>`（第二部份首字母必须大写）

**实现细节：**

- 使用 `z.custom()` 实现自定义验证（Zod 无法定义复杂的字面量模版）
- 使用 `IsEqual` 确保推断类型与 `I18nText` 类型匹配

**关系：**

- 对应 `types/common.ts` 中的 `I18nText` 类型
- 被所有需要国际化支持的 Schema 使用

### `property.ts`

属性（Property）相关的 Schema 定义。

**Schema：**

- `PropertyBaseSchema`：属性基类 Schema
- `PropertyStringSchema`：字符串类型属性 Schema
- `PropertyNumberSchema`：数字类型属性 Schema（支持 `number` 和 `integer`）
- `PropertyBooleanSchema`：布尔类型属性 Schema
- `PropertyEncryptedStringSchema`：加密字符串类型属性 Schema
- `PropertyScalarSchema`：标量属性类型的联合 Schema（string、number、boolean、encrypted_string）
- `PropertiesScalarSchema`：标量属性数组 Schema（包含重复名称检查）
- `PropertyArraySchema`：数组类型属性 Schema
- `PropertyObjectSchema`：对象类型属性 Schema
- `PropertyDiscriminatedUnionSchema`：区分联合类型属性 Schema
- `PropertyCredentialIdSchema`：凭证 ID 类型属性 Schema
- `PropertySchema`：所有属性类型的联合 Schema
- `PropertiesSchema`：属性数组 Schema（包含重复名称检查）

**验证规则：**

- 属性名称验证：
  - 不能以 `$` 或空格开头
  - 不能包含 `.`、`[`、`]` 字符
  - 不能为空
- 显示条件验证：
  - 支持 MongoDB 风格的查询操作符（`$eq`、`$gt`、`$gte`、`$lt`、`$lte`、`$in`、`$nin`、`$ne`、`$exists`、`$regex`、`$mod`、`$size` 等）
  - 支持逻辑运算符（`$and`、`$or`、`$nor`）
- 区分联合类型验证：
  - `any_of` 必须至少包含 2 项
  - 每个项必须包含区分器字段，且值为常量（string/number/boolean）
  - 区分器值在所有项中必须唯一
- 对象类型验证：
  - 当定义了 `constant` 时，`properties` 必须为空
- 数组验证：
  - 使用递归 Schema 支持嵌套结构
  - 检查属性名称重复

**关系：**

- 对应 `types/property.ts` 中的各种 Property 类型
- 使用 `property-ui.ts` 中的 UI Schema
- 使用 `common.ts` 中的 `I18nEntrySchema`
- 使用 `utils/custom-json-value.ts` 中的 `JsonValueSchema`

### `property-ui.ts`

属性 UI 组件相关的 Schema 定义。

**Schema：**

- `PropertyUICommonPropsSchema`：UI 组件通用属性 Schema
- `PropertyUIOptionSchema`：选项 Schema（用于下拉、单选等组件）
- 各种组件特定的 Schema：
  - `PropertyUIInputPropsSchema`：输入框
  - `PropertyUITextareaPropsSchema`：文本域
  - `PropertyUINumberInputPropsSchema`：数字输入
  - `PropertyUICodeEditorPropsSchema`：代码编辑器
  - `PropertyUISingleSelectPropsSchema`：单选下拉
  - `PropertyUIRadioGroupPropsSchema`：单选组
  - `PropertyUIMultiSelectPropsSchema`：多选下拉
  - `PropertyUISwitchPropsSchema`：开关
  - `PropertyUICheckboxPropsSchema`：复选框
  - `PropertyUISliderPropsSchema`：滑块
  - `PropertyUIKeyValueEditorPropsSchema`：键值对编辑器
  - `PropertyUITagInputPropsSchema`：标签输入
  - `PropertyUIEmojiPickerPropsSchema`：表情选择器
  - `PropertyUIColorPickerPropsSchema`：颜色选择器
  - `PropertyUICredentialSelectPropsSchema`：凭证选择
  - `PropertyUIJsonSchemaEditorPropsSchema`：JSON Schema 编辑器
  - `PropertyUIConditionsEditorPropsSchema`：条件编辑器
  - `PropertyUIArraySectionPropsSchema`：数组区块
  - `PropertyUICollapsiblePanelPropsSchema`：可折叠面板
  - `PropertyUIEncryptedInputPropsSchema`：加密输入

**类型联合 Schema：**

- `PropertyUIPropsSchema`：所有 UI 组件的区分联合 Schema（基于 `component` 字段）
- `PropertyUIStringSchema`：字符串类型可用的 UI 组件
- `PropertyUINumberSchema`：数字类型可用的 UI 组件
- `PropertyUIBooleanSchema`：布尔类型可用的 UI 组件
- `PropertyUIArraySchema`：数组类型可用的 UI 组件
- `PropertyUIObjectSchema`：对象类型可用的 UI 组件
- `PropertyUICredentialIdSchema`：凭证 ID 类型可用的 UI 组件
- `PropertyUIDiscriminatorUISchema`：区分器字段可用的 UI 组件
- `PropertyUIEncryptedStringSchema`：加密字符串类型可用的 UI 组件

**特殊验证：**

- `indentation` 字段：必须是 2-80 之间的偶数（使用字面量联合类型）

**关系：**

- 对应 `types/property-ui.ts` 中的各种 UI 类型
- 被 `property.ts` 中的各种 Property Schema 使用

### `definition.ts`

插件定义相关的 Schema 定义。

**Schema：**

- `BaseDefinitionSchema`：基础定义 Schema
  - `name`：名称验证（4-64 字符，字母开头，字母或数字结尾，可包含 `_` 和 `-`，但不能连续出现）
  - `display_name`：显示名称（I18n）
  - `description`：描述（I18n）
  - `icon`：图标（字符串）
- `PluginDefinitionSchema`：插件定义 Schema
  - 继承 `BaseDefinition`（但省略 `parameters`）
  - `author`：作者名称
  - `email`：作者邮箱（验证邮箱格式）
  - `repo`：仓库 URL（可选，验证 HTTP URL）
  - `version`：版本号（可选）
  - `locales`：支持的语言列表
- `CredentialDefinitionSchema`：凭证定义 Schema
  - 继承 `BaseDefinition`，但其 `parameters` 字段仅允许标量属性（使用 `PropertiesScalarSchema` / `Array<PropertyScalar>`）
- `DataSourceDefinitionSchema`：数据源定义 Schema
  - 继承 `BaseDefinition`，并增加 `parameters` 字段（使用仅允许标量属性的 `PropertiesScalarSchema`，与 `CredentialDefinition` 一致）
- `ModelDefinitionSchema`：模型定义 Schema
  - 继承 `BaseDefinition`（但省略 `parameters`）
  - `name`：模型名称（支持 `/` 字符，格式：`model_provider/model_name`）
  - `model_type`：模型类型（目前仅支持 `"llm"`）
  - `default_endpoint`：默认端点（可选 HTTP URL）
  - `input_modalities`：支持的输入类型（`file`、`image`、`text`）
  - `output_modalities`：支持的输出类型（`text`）
  - `pricing`：定价信息（可选）
  - `override_parameters`：覆盖默认参数（可选）
  - `unsupported_parameters`：不支持的参数列表
- `ToolDefinitionSchema`：工具定义 Schema
  - 继承 `BaseDefinition`
  - `invoke`：调用函数（验证函数签名和返回类型）

**关系：**

- 对应 `types/definition.ts` 中的各种 Definition 类型
- 使用 `property.ts` 中的 `PropertiesSchema` 和 `PropertiesScalarSchema`
- 使用 `common.ts` 中的 `I18nEntrySchema`
- 使用 `utils/custom-json-value.ts` 中的 `JsonValueSchema`

## 依赖关系

- **依赖：**
  - `zod`（Schema 验证库）
  - `type-fest`（工具类型，如 `IsEqual`）
  - `es-toolkit`（工具函数，如 `isPlainObject`、`compact`）
  - `src/types/`（所有类型定义）
  - `src/utils/custom-json-value.ts`（`JsonValueSchema`）
- **被依赖：**
  - `src/schemas.ts`（统一导出）

## 设计模式

1. **类型安全验证：** 使用 `IsEqual` 工具类型确保 Schema 推断类型与 TypeScript 类型完全匹配
2. **递归 Schema：** 使用 `z.lazy()` 实现递归结构（如 `PropertyArray`、`PropertyObject`）
3. **区分联合：** 使用 `z.discriminatedUnion()` 实现基于 `component` 字段的类型区分
4. **自定义验证：** 使用 `z.custom()` 实现复杂验证逻辑（如 `I18nEntrySchema`）
5. **继承与组合：** 使用 `z.object().extend()`、`.omit()`、`.merge()` 等方法实现 Schema 复用
