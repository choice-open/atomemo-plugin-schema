# Tests 模块

项目单元测试，使用 [Bun Test](https://bun.sh/docs/cli/test) 运行。

## 目录结构

| 目录/文件 | 说明 |
|-----------|------|
| [`schemas/`](./schemas/README.md) | Schema 验证测试 |
| [`utils/`](./utils/README.md) | 工具模块测试 |

## 运行测试

```bash
bun test --dots
```

或运行特定测试目录：

```bash
bun test tests/schemas/
```

## 测试模块说明

### `schemas/`

包含所有 Zod Schema 的边界条件测试，确保 Schema 验证逻辑的正确性和完整性。

**测试文件：**
- `common.test.ts` - I18nEntrySchema 测试
- `definition.test.ts` - 各种 Definition Schema 测试
- `property.test.ts` - Property Schema 测试
- `property-ui.test.ts` - Property UI 组件 Schema 测试

详细说明请参考 [schemas/OVERVIEW.md](./schemas/OVERVIEW.md)。

### `utils/`

包含 `src/utils/*` 的单元测试。

## 测试原则

1. **边界条件测试：** 重点测试 Schema 的边界条件和错误情况
2. **类型安全验证：** 确保 Schema 推断类型与 TypeScript 类型匹配
3. **完整覆盖：** 覆盖所有 Schema 的主要验证规则和边界情况
