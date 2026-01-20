# @choiceopen/atomemo-plugin-schema

[English](./README.md) | [中文](./README.zh-CN.md)

A comprehensive TypeScript type definitions and Zod schema validation library for developing Choiceform Atomemo plugins. This library ensures type safety at compile time and runtime validation for plugin definitions.

## Features

- 🎯 **Type Safety**: Complete TypeScript type definitions for plugin development
- ✅ **Runtime Validation**: Zod schema validation for plugin definitions
- 🌍 **i18n Support**: Built-in internationalization text types and validation
- 🎨 **Flexible Property System**: Support for various data types and UI components
- 🔧 **Conditional Display**: Conditional display logic based on other property values
- 📦 **Tree-shakeable**: Optimized exports for minimal bundle size

## Installation

```bash
# Using npm
npm install @choiceopen/atomemo-plugin-schema zod

# Using yarn
yarn add @choiceopen/atomemo-plugin-schema zod

# Using pnpm
pnpm add @choiceopen/atomemo-plugin-schema zod

# Using bun
bun add @choiceopen/atomemo-plugin-schema zod
```

> **Note**: `zod` is a peer dependency and must be installed separately.

## Quick Start

### Import Types

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

### Import Schemas

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

### Example: Define a Plugin

```typescript
import { PluginDefinitionSchema } from '@choiceopen/atomemo-plugin-schema/schemas';
import type { PluginDefinition } from '@choiceopen/atomemo-plugin-schema/types';

const pluginDefinition: PluginDefinition = {
  name: 'my-plugin',
  display_name: {
    en: 'My Plugin',
    zh_CN: '我的插件',
  },
  description: {
    en: 'A sample plugin for Atomemo',
    zh_CN: '一个示例插件',
  },
  icon: 'https://example.com/icon.png',
  author: {
    name: 'John Doe',
    email: 'john@example.com',
    repository_url: 'https://github.com/john/my-plugin',
  },
  version: '1.0.0',
  supported_languages: ['en', 'zh_CN'],
};

// Validate at runtime
const result = PluginDefinitionSchema.safeParse(pluginDefinition);
if (!result.success) {
  console.error('Validation failed:', result.error);
}
```

## Core Concepts

### Plugin Definition

A plugin definition contains metadata about your plugin:

- Basic information: name, display name, description, icon
- Author information: name, email, repository URL, version
- Supported languages list

### Feature Definitions

Feature definitions include:

- **Credential**: For storing and managing authentication information
- **DataSource**: For connecting to external data sources
- **Model**: For defining LLM models
- **Tool**: For executing specific functions

### Property System

The property system is the core of defining plugin parameters and settings:

**Property Types:**
- `string`: String type
- `number` / `integer`: Number type
- `boolean`: Boolean type
- `array`: Array type
- `object`: Object type
- `discriminated_union`: Discriminated union type
- `credential_id`: Credential ID type
- `encrypted_string`: Encrypted string type

**Property Features:**
- Constant values (`constant`)
- Default values (`default`)
- Enum values (`enum`)
- Range constraints (`min_length`, `max_length`, `minimum`, `maximum`, `min_items`, `max_items`)
- Conditional display (`display.hide/show`)
- AI configuration (`ai.llm_description`)

### UI Component System

Each property type can be configured with different UI components:

**String type components:**
- `input`, `textarea`, `expression-input`, `expression-textarea`
- `code-editor`, `select`, `radio-group`
- `emoji-picker`, `color-picker`, `credential-select`

**Number type components:**
- `number-input`, `slider`

**Boolean type components:**
- `switch`, `checkbox`

**Array type components:**
- `multi-select`, `tag-input`, `key-value-editor`, `slider`, `array-section`

**Object type components:**
- `collapsible-panel`, `json-schema-editor`, `conditions-editor`, `code-editor`

### Conditional Display System

Supports conditional display logic based on other property values:

**Operators:**
- Comparison: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`
- Existence check: `$exists`
- Set operations: `$in`, `$nin`
- Regex matching: `$regex`, `$options`
- Array operations: `$size`, `$mod`
- Logical combination: `$and`, `$or`, `$nor`

## API Reference

### Exports

The package exports two main entry points:

- `@choiceopen/atomemo-plugin-schema/types` - TypeScript type definitions
- `@choiceopen/atomemo-plugin-schema/schemas` - Zod schema validators

### Development Exports

In development environments, the package exports source files directly for better debugging and hot reload support:

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

## Development

### Prerequisites

- [Bun](https://bun.sh) >= 1.0.0
- Node.js >= 18.0.0 (if not using Bun)

### Setup

```bash
# Install dependencies
bun install
```

### Available Scripts

```bash
# Watch and rebuild in development
bun run dev

# Build the library
bun run build

# Run linting and formatting
bun run check

# Run type checking
bun run typecheck

# Run unit tests
bun run test
```

### Code Quality

This project uses [Biome](https://biomejs.dev) for unified linting and formatting. For the best development experience, install the [Biome VS Code extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome).

## Project Structure

```
atomemo-plugin-schema/
├── src/                    # Source code
│   ├── schemas/           # Zod schema validation modules
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── schemas.ts         # Schema exports
│   └── types.ts           # Type exports
├── tests/                  # Test files
├── dist/                  # Build output
└── [config files]         # package.json, tsconfig.json, etc.
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Follow the project's code style (use Biome for formatting)
2. Ensure all tests pass
3. Ensure type safety (use `IsEqual` for validation)
4. Update relevant documentation
5. Run `bun run check` and `bun run test` before submitting

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`bun run check && bun run test`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/choice-open/atomemo-plugin-schema#readme)
- 🐛 [Issue Tracker](https://github.com/choice-open/atomemo-plugin-schema/issues)
- 💬 [Discussions](https://github.com/choice-open/atomemo-plugin-schema/discussions)

## Acknowledgments

- Built with [TypeScript](https://www.typescriptlang.org/)
- Schema validation powered by [Zod](https://zod.dev/)
- Tool types from [type-fest](https://github.com/sindresorhus/type-fest)
