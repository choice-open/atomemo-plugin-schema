# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/choice-open/atomemo-plugin-schema/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/choice-open/atomemo-plugin-schema/releases/tag/v0.1.0
