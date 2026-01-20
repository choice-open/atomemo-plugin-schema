# types 目录

TypeScript 类型定义模块。提供所有插件的类型接口，与 `schemas/` 目录中的 Zod Schema 一一对应。

## 模块说明

### `common.ts`

基础通用类型定义。

**类型：**

- `I18nText`：国际化文本类型，必须包含 `en_US` 字段，支持其他语言代码（格式：`<语言代码>_<国家或脚本代码>`）

**关系：**

- 对应 `schemas/common.ts` 中的 `I18nEntrySchema`
- 被所有需要国际化支持的模块使用

### `property.ts`

属性（Property）相关的类型定义。

**类型：**

- `PropertyBase<TName>`：属性基类，包含名称、显示名称、描述、显示条件等通用字段
- `PropertyString`：字符串类型属性
- `PropertyNumber`：数字类型属性（支持 `number` 和 `integer`）
- `PropertyBoolean`：布尔类型属性
- `PropertyEncryptedString`：加密字符串类型属性
- `PropertyScalar<TName>`：标量属性类型的联合（string、number、boolean、encrypted_string）
- `PropertyArray`：数组类型属性
- `PropertyObject`：对象类型属性
- `PropertyDiscriminatedUnion`：区分联合类型属性
- `PropertyCredentialId`：凭证 ID 类型属性
- `Property<TName, TValue>`：所有属性类型的联合类型

**特性：**

- 支持条件显示（`display.hide/show`）
- 支持 AI 相关配置（`ai.llm_description`）
- 支持常量值、默认值、枚举值
- 支持嵌套结构和递归定义

**关系：**

- 对应 `schemas/property.ts` 中的各种 Property Schema
- 被 `definition.ts` 中的 `BaseDefinition` 使用

### `property-ui.ts`

属性 UI 组件相关的类型定义。

**类型：**

- `PropertyUICommonProps`：UI 组件通用属性（禁用、提示、占位符、只读、敏感、宽度、缩进等）
- `PropertyUIInputProps`：输入框组件
- `PropertyUITextareaProps`：文本域组件
- `PropertyUINumberInputProps`：数字输入组件
- `PropertyUICodeEditorProps`：代码编辑器组件
- `PropertyUISingleSelectProps`：单选下拉组件
- `PropertyUIRadioGroupProps`：单选组组件
- `PropertyUIMultiSelectProps`：多选下拉组件
- `PropertyUISwitchProps`：开关组件
- `PropertyUISliderProps`：滑块组件
- `PropertyUIKeyValueEditorProps`：键值对编辑器组件
- `PropertyUITagInputProps`：标签输入组件
- `PropertyUIEmojiPickerProps`：表情选择器组件
- `PropertyUIColorPickerProps`：颜色选择器组件
- `PropertyUICredentialSelectProps`：凭证选择组件
- `PropertyUIJsonSchemaEditorProps`：JSON Schema 编辑器组件
- `PropertyUIConditionsEditorProps`：条件编辑器组件
- `PropertyUIArraySectionProps`：数组区块组件
- `PropertyUICollapsiblePanelProps`：可折叠面板组件
- `PropertyUISectionProps`：区块组件
- `PropertyUIEncryptedInputProps`：加密输入组件

**类型联合：**

- `PropertyUIString`：字符串类型可用的 UI 组件
- `PropertyUINumber`：数字类型可用的 UI 组件
- `PropertyUIBoolean`：布尔类型可用的 UI 组件
- `PropertyUIArray`：数组类型可用的 UI 组件
- `PropertyUIContainer`：容器类型可用的 UI 组件
- `PropertyUIObject`：对象类型可用的 UI 组件
- `PropertyUICredentialId`：凭证 ID 类型可用的 UI 组件
- `PropertyUIEncryptedString`：加密字符串类型可用的 UI 组件

**关系：**

- 对应 `schemas/property-ui.ts` 中的各种 UI Schema
- 被 `property.ts` 中的各种 Property 类型使用

### `definition.ts`

插件定义相关的类型定义。

**类型：**

- `BaseDefinition`：基础定义，所有功能定义的基类
- `PluginDefinition<Locales, TransporterOptions>`：插件定义
- `CredentialDefinition`：凭证定义
- `DataSourceDefinition`：数据源定义
- `ModelDefinition`：模型定义
- `ToolDefinition`：工具定义
- `Feature`：所有功能类型的联合类型

**关系：**

- 对应 `schemas/definition.ts` 中的各种 Definition Schema
- 使用 `property.ts` 中的 `Property` 类型
- 使用 `utils/custom-json-value.ts` 中的 `JsonValue` 类型

## 依赖关系

- **依赖：**
  - `type-fest`（工具类型，如 `JsonValue`、`JsonObject`、`LiteralUnion`、`IntRange`、`IsEqual`）
  - `src/utils/custom-json-value.ts`（`JsonValue` 类型）
- **被依赖：**
  - `src/schemas/`（所有 Schema 文件都使用对应的类型进行类型检查）
  - `src/types.ts`（统一导出）

## 设计模式

1. **类型与 Schema 分离：** 类型定义在 `types/`，验证逻辑在 `schemas/`
2. **类型安全验证：** 使用 `IsEqual` 工具类型确保 Schema 推断类型与 TypeScript 类型完全匹配
3. **泛型设计：** 使用泛型支持类型参数化（如 `PropertyBase<TName>`）
