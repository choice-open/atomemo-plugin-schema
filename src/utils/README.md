# utils 目录

工具函数和辅助模块。

## 模块说明

### `custom-json-value.ts`

提供自定义的 JSON 值 Schema 和类型定义。

**功能：**
- 导出 `JsonValueSchema`：基于 Zod 的 `z.json()` 实现的 JSON 值验证 Schema
- 导出 `JsonValue` 类型：从 Schema 推断出的 JSON 值类型

**为什么需要：**
- Zod 的 `z.json()` 与 `type-fest` 的 `JsonValue` 类型不兼容
- 提供统一的 JSON 值类型定义，确保类型安全

**使用场景：**
- 在 Property 定义中表示任意 JSON 值
- 在 Tool 的 `invoke` 函数返回值中使用
- 在条件表达式中使用

## 依赖关系

- **依赖：** `zod`（用于 Schema 定义）
- **被依赖：** 
  - `src/schemas/property.ts`（使用 `JsonValueSchema`）
  - `src/types/definition.ts`（使用 `JsonValue` 类型）
