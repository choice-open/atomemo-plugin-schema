# @choiceopen/atomemo-plugin-schema

[English](./README.md) | [中文](./README.zh-CN.md)

一个全面的 TypeScript 类型定义和 Zod Schema 验证库，用于开发 Choiceform Atomemo 插件。该库确保插件定义在编译时和运行时的类型安全与验证。插件需要通过 `lang` 字段声明实现语言（目前支持 `elixir` 与 `typescript`）。

## 特性

- 🎯 **类型安全**: 完整的 TypeScript 类型定义，支持插件开发
- ✅ **运行时验证**: 使用 Zod Schema 进行运行时验证
- 🌍 **国际化支持**: 内置国际化文本类型和验证
- 🎨 **灵活的属性系统**: 支持多种数据类型和 UI 组件
- 🔧 **条件显示**: 基于其他属性值的条件显示逻辑
- 📦 **Tree-shakeable**: 优化的导出，最小化打包体积

## 安装

```bash
# 使用 npm
npm install @choiceopen/atomemo-plugin-schema zod

# 使用 yarn
yarn add @choiceopen/atomemo-plugin-schema zod

# 使用 pnpm
pnpm add @choiceopen/atomemo-plugin-schema zod

# 使用 bun
bun add @choiceopen/atomemo-plugin-schema zod
```

> **注意**: `zod` 是 peer dependency，需要单独安装。

## 快速开始

### 导入类型

```typescript
import type {
  PluginDefinition,
  CredentialDefinition,
  DataSourceDefinition,
  ModelDefinition,
  ToolDefinition,
  Property,
} from '@choiceopen/atomemo-plugin-schema/types';
```

### 导入 Schema

```typescript
import {
  PluginDefinitionSchema,
  CredentialDefinitionSchema,
  DataSourceDefinitionSchema,
  ModelDefinitionSchema,
  ToolDefinitionSchema,
  PropertySchema,
} from '@choiceopen/atomemo-plugin-schema/schemas';
```

### 示例：定义一个插件

```typescript
import { PluginDefinitionSchema } from '@choiceopen/atomemo-plugin-schema/schemas';
import type { PluginDefinition } from '@choiceopen/atomemo-plugin-schema/types';

const pluginDefinition: PluginDefinition = {
  name: 'my-plugin',
  display_name: {
    en_US: 'My Plugin',
    zh_CN: '我的插件',
  },
  description: {
    en_US: 'A sample plugin for Atomemo',
    zh_CN: '一个示例插件',
  },
  icon: 'https://example.com/icon.png',
  version: '1.0.0',
  locales: ['en', 'zh_CN'],
  lang: 'typescript',
};

// 运行时验证
const result = PluginDefinitionSchema.safeParse(pluginDefinition);
if (!result.success) {
  console.error('验证失败:', result.error);
}
```

## 核心概念

### 插件定义

插件定义包含插件的元数据：

- 基本信息：名称、显示名称、描述、图标
- 作者信息：名称、邮箱、仓库 URL、版本
- 支持的语言列表

### 功能定义

功能定义包括：

- **Credential（凭证）**: 用于存储和管理认证信息
- **DataSource（数据源）**: 用于连接外部数据源
- **Model（模型）**: 用于定义 LLM 模型
- **Tool（工具）**: 用于执行特定功能

### 属性系统

属性系统是定义插件参数和设置的核心：

**属性类型：**
- `string`: 字符串类型
- `number` / `integer`: 数字类型
- `boolean`: 布尔类型
- `array`: 数组类型
- `object`: 对象类型
- `discriminated_union`: 区分联合类型
- `credential_id`: 凭证 ID 类型
- `encrypted_string`: 加密字符串类型
- `resource_locator`: 资源定位类型（支持 list/url/id 模式）
- `resource_mapper`: 资源字段映射类型（用于结构化字段映射）

**属性特性：**
- 常量值（`constant`）
- 默认值（`default`）
- 枚举值（`enum`）
- 范围限制（`min_length`、`max_length`、`minimum`、`maximum`、`min_items`、`max_items`）
- 条件显示（`display.hide/show`）
- AI 配置（`ai.llm_description`）

### UI 组件系统

每个属性类型可以配置不同的 UI 组件：

**字符串类型可用组件：**
- `input`、`textarea`、`code-editor`
- `select`、`radio-group`
- `emoji-picker`、`color-picker`、`credential-select`

**数字类型可用组件：**
- `number-input`、`slider`

**布尔类型可用组件：**
- `switch`

**数组类型可用组件：**
- `multi-select`、`tag-input`、`key-value-editor`、`slider`、`array-section`

**对象类型可用组件：**
- `collapsible-panel`、`json-schema-editor`、`conditions-editor`、`code-editor`

### 条件显示系统

支持基于其他属性值的条件显示逻辑：

**操作符：**
- 比较操作符：`$eq`、`$ne`、`$gt`、`$gte`、`$lt`、`$lte`
- 存在性检查：`$exists`
- 集合操作：`$in`、`$nin`
- 正则匹配：`$regex`、`$options`
- 数组操作：`$size`、`$mod`
- 逻辑组合：`$and`、`$or`、`$nor`

## API 参考

### 导出

包导出两个主要入口点：

- `@choiceopen/atomemo-plugin-schema/types` - TypeScript 类型定义
- `@choiceopen/atomemo-plugin-schema/schemas` - Zod Schema 验证器

### 开发环境导出

在开发环境中，包直接导出源文件，以便更好地调试和支持热重载：

```json
{
  "./schemas": {
    "development": "./src/schemas.ts",
    "default": "./dist/schemas.js"
  },
  "./types": {
    "development": "./src/types.ts",
    "default": "./dist/types.js"
  }
}
```

## 开发

### 前置要求

- [Bun](https://bun.sh) >= 1.0.0
- Node.js >= 18.0.0（如果不使用 Bun）

### 设置

```bash
# 安装依赖
bun install
```

### 可用脚本

```bash
# 开发模式监听并重新构建
bun run dev

# 构建库
bun run build

# 运行代码检查和格式化
bun run check

# 运行类型检查
bun run typecheck

# 运行单元测试
bun run test
```

### 代码质量

本项目使用 [Biome](https://biomejs.dev) 进行统一的代码检查和格式化。为了获得最佳的开发体验，请安装 [Biome VS Code 扩展](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)。

## 项目结构

```
atomemo-plugin-schema/
├── src/                    # 源代码
│   ├── schemas/           # Zod Schema 验证模块
│   ├── types/             # TypeScript 类型定义
│   ├── utils/             # 工具函数
│   ├── schemas.ts         # Schema 导出
│   └── types.ts           # 类型导出
├── tests/                  # 测试文件
├── dist/                  # 构建输出
└── [配置文件]             # package.json, tsconfig.json 等
```

## 贡献

欢迎贡献！请遵循以下指南：

1. 遵循项目的代码风格（使用 Biome 进行格式化）
2. 确保所有测试通过
3. 确保类型安全（使用 `IsEqual` 进行验证）
4. 更新相关文档
5. 提交前运行 `bun run check` 和 `bun run test`

### 开发工作流

1. Fork 仓库
2. 创建功能分支（`git checkout -b feature/amazing-feature`）
3. 进行更改
4. 运行测试和代码检查（`bun run check && bun run test`）
5. 提交更改（`git commit -m '添加一些很棒的功能'`）
6. 推送到分支（`git push origin feature/amazing-feature`）
7. 打开 Pull Request

## 变更日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解变更列表和版本历史。

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 支持

- 📖 [文档](https://github.com/choice-open/atomemo-plugin-schema#readme)
- 🐛 [问题追踪](https://github.com/choice-open/atomemo-plugin-schema/issues)
- 💬 [讨论](https://github.com/choice-open/atomemo-plugin-schema/discussions)

## 致谢

- 使用 [TypeScript](https://www.typescriptlang.org/) 构建
- Schema 验证由 [Zod](https://zod.dev/) 提供支持
- 工具类型来自 [type-fest](https://github.com/sindresorhus/type-fest)
