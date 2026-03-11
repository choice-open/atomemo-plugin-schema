# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.1] - 2026-03-11

### Fixed

- Typed `CredentialDefinition.authenticate` input `args.extra` as optional (`{ ... } | undefined`) so the whole field can be omitted

## [0.4.0] - 2026-03-11

### Added

- Added `FileRefSchema` and `FileRef` for validating and typing file references
- Added `PluginContextSchema` and `PluginContext` with file helpers for attaching remote URLs, downloading, uploading, and parsing file references

### Changed

- Updated `ToolDefinition.invoke` and `CredentialDefinition.authenticate` to use typed `PluginContext` instead of loose context records

## [0.3.3] - 2026-03-11

### Fixed

- Changed `context` parameter type from `unknown` to `any` in `ToolDefinitionSchema` and `ToolDefinition` type

## [0.3.2] - 2026-03-11

### Fixed

- Changed `context` parameter type from `unknown` to `any` in `CredentialDefinitionSchema` and `CredentialDefinition` type

## [0.3.1] - 2026-03-10

### Changed

- Updated dependencies:
  - `tsdown`: ^0.20.3 → ^0.21.1

## [0.3.0] - 2026-03-06

### Added

- Added `context` parameter to `ToolDefinition.invoke` and `CredentialDefinition.authenticate` input for passing runtime context

### Changed

- Made `CredentialDefinition.authenticate` input `args.extra` field optional
- Updated dependencies:
  - `@biomejs/biome`: ^2.3.14 → ^2.4.6
  - `@types/bun`: ^1.3.9 → ^1.3.10

## [0.2.18] - 2026-03-10

### Added

- Added `file_ref` property type (`PropertyFileReference`) and schema (`PropertyFileReferenceSchema`) for file reference properties

## [0.2.17] - 2026-03-06

### Added

- Added `markdown` as a valid language option for the code editor component schema

## [0.2.16] - 2026-03-04

### Changed

- Updated `ToolDefinition.invoke` credentials type from `Record<string, any>` to `Record<string, Record<string, any>>` to reflect that each credential is a map of key-value pairs

## [0.2.15] - 2026-02-14

### Changed

- Updated `CredentialDefinition` to include 'google_ai' as a valid adapter

## [0.2.14] - 2026-02-14

### Fixed

- `PropertyObject.additional_properties` schema now accepts `PropertyDiscriminatedUnion` at runtime (previously only the type allowed it; validation now matches)

## [0.2.13] - 2026-02-14

### Changed

- **PropertyDiscriminatedUnion** is no longer a top-level property type: it can only be used as `PropertyObject.additional_properties` or `PropertyArray.items`
- Simplified `PropertyDiscriminatedUnion` type: removed `TName` generic and no longer extends `PropertyBase` (no `name`, `display_name`, etc.)
- `PropertyObject.additional_properties` and `PropertyArray.items` now accept `Property | PropertyDiscriminatedUnion<string>`
- `PropertyCredentialId` and `PropertyEncryptedString` now explicitly allow optional `constant`, `default`, and `enum` as `null` for consistency with other property types

## [0.2.12] - 2026-02-13

### Changed

- Updated `ToolDefinition.invoke` credentials type from `Record<string, string>` to `Record<string, any>` to allow more flexible credential value types

## [0.2.11] - 2026-02-12

### Changed

- Refined `CredentialDefinition` schema:
  - Changed `authenticate.args.credential` type from `unknown` to `string | null | undefined`
  - Changed `authenticate.args.extra.model` from nullish to optional string
  - Added required `api_key` field to `authenticate` output
  - Changed `authenticate.output` to use `z.looseObject` for more flexibility
  - Changed `authenticate.output.endpoint` and `headers` from nullish to optional
  - Added optional `model` field to `authenticate` output

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

[Unreleased]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.3.3...v0.4.0
[0.3.3]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.18...v0.3.3
[0.3.2]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.18...v0.3.0
[0.2.18]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.17...v0.2.18
[0.2.17]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.16...v0.2.17
[0.2.16]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.15...v0.2.16
[0.2.15]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.14...v0.2.15
[0.2.14]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.13...v0.2.14
[0.2.13]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.12...v0.2.13
[0.2.12]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.11...v0.2.12
[0.2.11]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.2.10...v0.2.11
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
