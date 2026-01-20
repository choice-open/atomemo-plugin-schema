# tests/schemas/

`src/schemas/*` 的单元测试（重点是边界条件与失败用例），确保运行时验证与类型约束保持一致。

## 入口文档

- [`OVERVIEW.md`](./OVERVIEW.md): 覆盖范围与已解决问题记录

## 测试文件

- `common.test.ts`: `I18nEntrySchema`（国际化词条）校验
- `definition.test.ts`: `BaseDefinitionSchema` / `PluginDefinitionSchema` / `CredentialDefinitionSchema` / `DataSourceDefinitionSchema` / `ModelDefinitionSchema` / `ToolDefinitionSchema`
- `property.test.ts`: Property 系统（名称约束、条件显示、递归结构、区分联合等）
- `property-ui.test.ts`: UI 组件 `component` 区分联合与 props 校验

