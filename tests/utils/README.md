# tests/utils/

`src/utils/*` 的单元测试。

## 测试文件

- `custom-json-value.test.ts`: 覆盖 `JsonValueSchema` 对 JSON primitives / arrays / objects 的接受与对非 JSON 值（`undefined`、function、`Symbol`、`BigInt`）的拒绝

