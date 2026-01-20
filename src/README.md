# src 目录

源代码目录，包含所有插件的类型定义和验证 Schema。

## 目录结构

| 目录/文件 | 说明 |
|-----------|------|
| [`schemas/`](./schemas/README.md) | Zod Schema 验证模块 |
| [`types/`](./types/README.md) | TypeScript 类型定义模块 |
| [`utils/`](./utils/README.md) | 工具函数和辅助模块 |
| `schemas.ts` | Schema 统一导出入口 |
| `types.ts` | 类型统一导出入口 |

## 模块说明

### `schemas.ts`

Schema 统一导出入口，导出所有 Zod Schema。

**导出内容：**
- `I18nEntrySchema`（来自 `schemas/common.ts`）
- `BaseDefinitionSchema`、`PluginDefinitionSchema`、`CredentialDefinitionSchema`、`DataSourceDefinitionSchema`、`ModelDefinitionSchema`、`ToolDefinitionSchema`（来自 `schemas/definition.ts`）
- `PropertiesSchema`、`PropertySchema` 及各种 Property Schema（来自 `schemas/property.ts`）
- 各种 Property UI Schema（来自 `schemas/property-ui.ts`）
- `JsonValueSchema`（来自 `utils/custom-json-value.ts`）

**使用场景：**
- 插件开发时进行运行时验证
- 在插件注册时验证定义格式

### `types.ts`

类型统一导出入口，导出所有 TypeScript 类型。

**导出内容：**
- `I18nText`（来自 `types/common.ts`）
- `BaseDefinition`、`PluginDefinition`、`CredentialDefinition`、`DataSourceDefinition`、`ModelDefinition`、`ToolDefinition`、`Feature`（来自 `types/definition.ts`）
- 所有 Property 类型（来自 `types/property.ts`）
- 所有 Property UI 类型（来自 `types/property-ui.ts`）
- `JsonValue`（来自 `utils/custom-json-value.ts`）

**使用场景：**
- 插件开发时提供类型提示
- 在 TypeScript 项目中获得类型安全

## 模块关系

```
schemas.ts ──┐
             ├──> schemas/ ──> types/ ──> utils/
types.ts ────┘
```

1. **schemas/** 和 **types/** 一一对应，提供运行时验证和编译时类型检查
2. **utils/** 提供通用工具（如 `JsonValueSchema`）
3. **schemas.ts** 和 **types.ts** 作为统一导出入口，简化导入路径

## 设计原则

1. **类型与 Schema 分离：** 类型定义在 `types/`，验证逻辑在 `schemas/`
2. **类型安全验证：** 使用 `IsEqual` 确保 Schema 推断类型与 TypeScript 类型完全匹配
3. **统一导出：** 通过 `schemas.ts` 和 `types.ts` 提供清晰的 API 接口
4. **模块化设计：** 按功能划分模块，便于维护和扩展

## 依赖关系

- **外部依赖：**
  - `zod`：Schema 验证库（peer dependency）
  - `type-fest`：工具类型库
  - `es-toolkit`：工具函数库（仅 schemas 使用）

- **内部依赖：**
  - `schemas/` 依赖 `types/` 进行类型检查
  - `schemas/` 和 `types/` 都依赖 `utils/` 的通用工具
