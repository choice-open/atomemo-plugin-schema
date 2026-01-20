/**
 * Custom JSON Value Schema and Type
 *
 * Why? Because `z.json()` is not compatible with `JSONValue` from type-fest
 */

import { z } from "zod"

/**
 * Custom JSON Value Schema
 * @description Custom JSON Value Schema is a schema that allows any JSON value
 */
export const JsonValueSchema = z.json()

/**
 * Custom JSON Value Type
 * @description Custom JSON Value Type is the type of the JSON value
 */
export type JsonValue = z.infer<typeof JsonValueSchema>
