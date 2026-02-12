# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.10] - 2026-02-12

### Changed

- Enhanced `PropertyDiscriminatedUnionSchema` with duplicate name checking in `any_of` field

## [0.2.9] - 2026-02-12

### Changed

- Updated `CredentialDefinition` schema to use `unknown` type for credential values

## [0.2.8] - 2026-02-12

### Changed

- Refined model name validation rules in `ModelDefinitionSchema`
- Added new test cases for edge case name lengths

## [0.2.7] - 2026-02-11

### Changed

- Enhanced `CredentialDefinition` schema to make `authenticate` method optional
- Improved model name validation rule in `ModelDefinitionSchema`
- Updated `@types/bun` to version 1.3.9

## [0.2.6] - 2026-02-11

### Added

- Exported individual property schema validators for external use:
  - `PropertyStringSchema` - for validating string properties
  - `PropertyNumberSchema` - for validating number/integer properties
  - `PropertyBooleanSchema` - for validating boolean properties
  - `PropertyObjectSchema` - for validating object properties
  - `PropertyArraySchema` - for validating array properties
  - `PropertyDiscriminatedUnionSchema` - for validating discriminated union properties
  - `PropertyCredentialIdSchema` - for validating credential_id properties
  - `PropertyEncryptedStringSchema` - for validating encrypted_string properties

## [0.2.5] - 2026-02-10

### Changed

- Allowed nullable values in credential and model definitions:
  - `CredentialDefinition.authenticate` now accepts nullish `extra.model` and returns nullish `endpoint` and `headers`
  - `ModelDefinition` now accepts nullish `default_endpoint`, `pricing`, and `override_parameters` fields (including nested defaults)

## [0.2.4] - 2026-02-10

### Changed

- Enhanced `package.json` exports configuration:
  - Added `development` condition for development mode imports
  - Updated exports paths to use consistent `./` prefix
  - Maintained separate development and production export configurations
- Updated `tsdown.config.ts` to set `devExports` to `true` for development mode support

## [0.2.3] - 2026-02-10

### Changed

- Refined `CredentialDefinitionSchema` to simplify authentication input structure:
  - Changed `args.parameters` to `args.credential` for clearer intent
  - Added `args.extra` field for additional authentication context (including optional `model` field)
  - Removed required `model` field from authentication output (now optional via endpoint configuration)
- Updated `package.json` exports to support conditional development mode imports
- Changed prepublishOnly script to preversion script for better release workflow

## [0.2.2] - 2026-02-10

### Changed

- Removed `json_schema`, `stream`, `stream_options`, and `structured_outputs` from `ModelDefinition.unsupported_parameters` type union to simplify the API surface

## [0.2.1] - 2026-02-09

### Documentation

- Update broken `CHANGELOG.md`

## [0.2.0] - 2026-02-09

### Added

- `authenticate` method to `CredentialDefinition` for LLM authentication
- Detailed type definitions for `authenticate` method input and output
- `credentials` field to `ToolDefinition.invoke` method input

### Changed

- Enhanced type safety for `ToolDefinition.invoke` method by replacing `any` with structured type
- Updated all comments from Chinese to English for consistency
- Changed build output format from CommonJS to ES modules (.mjs extension)
- Updated dependencies:
  - type-fest: ^5.4.1 → ^5.4.4
  - @biomejs/biome: ^2.3.11 → ^2.3.14
  - @types/bun: ^1.3.6 → ^1.3.8
  - bumpp: ^10.4.0 → ^10.4.1
  - tsdown: ^0.19.0 → ^0.20.3
  - zod: ^4.3.5 → ^4.3.6
- Added `--clean` flag to prepublishOnly script for cleaner builds
- Updated tsdown config to focus on ES modules output

## [0.1.8] - 2026-02-02

### Added

- Added required `lang` field to `PluginDefinition` types and schema so plugins must declare whether they are implemented in Elixir or TypeScript

## [0.1.7] - 2026-01-27

### Changed

- Refactored duplicate property names check to use a reusable `checkDuplicateNames` object instead of a function wrapper
  - Improves code maintainability and consistency across `ArrayPropertiesSchema` and `PropertiesScalarSchema`

## [0.1.6] - 2026-01-27

### Changed

- Updated all optional properties in property type definitions to accept `null` values in addition to `undefined`
  - Affected interfaces: `PropertyBase`, `PropertyString`, `PropertyNumber`, `PropertyBoolean`, `PropertyObject`, `PropertyArray`, `PropertyCredentialId`, `PropertyEncryptedString`, `FilterOperators`, `RootFilter`

## [0.1.5] - 2026-01-27

### Changed

- Changed `PluginDefinition` optional fields (`author`, `email`, `repo`, `version`) to accept both `undefined` and `null` values (using `.nullish()` instead of `.optional()`)

## [0.1.4] - 2026-01-26

### Changed

- Wrapped `PropertiesScalarSchema` export with `z.lazy()` to prevent circular reference issues
- Changed `PropertiesSchema` to use `ArrayPropertiesSchema` directly for consistency and to leverage existing circular reference handling
- Updated `devExports` option in `tsdown.config.ts` from `"development"` to `false` to disable development exports

## [0.1.3] - 2026-01-20

### Added

- Added `PropertyUISectionProps` component for section UI layout
- Added `PropertyUISectionPropsSchema` schema for section component validation
- Added `PropertyUIContainer` type union for container components (collapsible-panel, section)
- Added `PropertyUIContainerSchema` schema for container component validation
- Added `line_wrapping` property to `PropertyUICodeEditorProps` for enabling line wrapping in code editor
- Added `rows` property to `PropertyUICodeEditorProps` to specify number of visible rows

### Changed

- Updated `PropertyUIObject` type to include container components (collapsible-panel, section)
- Updated `PropertyUIObjectSchema` to include container component schemas

### Removed

- Removed `PropertyUICheckboxProps` component (use `PropertyUISwitchProps` instead)
- Removed `PropertyUICheckboxPropsSchema` schema
- Removed `PropertyUICheckboxProps` from `PropertyUIBoolean` type union
- Removed `html` language option from `PropertyUICodeEditorProps` (supported languages: json, javascript, python3)

## [0.1.2] - 2026-01-20

### Added

- Added `PropertyScalar<TName>` type union to group scalar property types (string, number, boolean, encrypted_string)
- Added `PropertiesScalarSchema` export for scalar properties array validation

### Removed

- Removed `PropertyUIExpressionInputProps` type and `PropertyUIExpressionInputPropsSchema` schema (expression input components are no longer supported)
- Removed `PropertyUIExpressionInputProps` from `PropertyUIProps` and `PropertyUIString` type unions
- Removed `PropertyUIDiscriminatorUnionUISchema` schema export
- Removed `ui` field from `PropertyDiscriminatedUnion` type and `PropertyDiscriminatedUnionSchema` schema (use `discriminator_ui` instead)
- Removed `settings` field from `BaseDefinition` type and `BaseDefinitionSchema` schema

## [0.1.1] - 2026-01-20

### Changed

- Made `author` and `email` fields optional in `PluginDefinition` type and schema
- Updated README examples to use `en_US` locale code instead of `en`
- Updated README examples to use `locales` field instead of `supported_languages`

### Added

- Added CHANGELOG.md following Keep a Changelog format
- Added Changelog section links in README and README.zh-CN.md

### Tests

- Updated tests to reflect `author` and `email` as optional fields
- Added test cases for plugin definitions without optional fields

## [0.1.0] - 2025-01-20

### Added

- Initial release of `@choiceopen/atomemo-plugin-schema`
- TypeScript type definitions for plugin development
- Zod schema validation for runtime type checking
- Internationalization support with `I18nText` type and `I18nEntrySchema`
- Property system with support for:
- UI component system with various component types for different property types
- Conditional display system with support for comparison, existence, set operations, regex matching, and logical combination operators
- Development environment support with direct source file exports for better debugging
- Comprehensive test suite with 193+ test cases
- Bilingual documentation (English and Chinese)

### Documentation

- Added comprehensive README with installation, quick start, and API reference
- Added Chinese version of README (README.zh-CN.md)
- Added project structure documentation
- Added development guidelines and contributing guide

[Unreleased]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.10...HEAD
[0.2.10]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.9...v0.2.10
[0.2.9]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.8...v0.2.9
[0.2.8]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.7...v0.2.8
[0.2.7]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.6...v0.2.7
[0.2.6]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.5...v0.2.6
[0.2.5]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.4...v0.2.5
[0.2.4]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.1.8...v0.2.0
[0.1.8]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/choice-open/atomemo-plugin-schema/releases/tag/v0.1.0
