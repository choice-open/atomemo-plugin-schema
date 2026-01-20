import { describe, expect, test } from "bun:test"
import { JsonValueSchema } from "../../src/utils/custom-json-value"

describe("JsonValueSchema", () => {
  test("should accept JSON primitives", () => {
    expect(JsonValueSchema.safeParse(null).success).toBe(true)
    expect(JsonValueSchema.safeParse(true).success).toBe(true)
    expect(JsonValueSchema.safeParse(false).success).toBe(true)
    expect(JsonValueSchema.safeParse(0).success).toBe(true)
    expect(JsonValueSchema.safeParse(123.456).success).toBe(true)
    expect(JsonValueSchema.safeParse("").success).toBe(true)
    expect(JsonValueSchema.safeParse("hello").success).toBe(true)
  })

  test("should accept arrays and objects", () => {
    expect(JsonValueSchema.safeParse([]).success).toBe(true)
    expect(JsonValueSchema.safeParse([1, "a", null, { k: "v" }]).success).toBe(true)
    expect(JsonValueSchema.safeParse({}).success).toBe(true)
    expect(JsonValueSchema.safeParse({ a: 1, b: "x", c: null, d: [true, false] }).success).toBe(
      true,
    )
  })

  test("should reject non-JSON values", () => {
    expect(JsonValueSchema.safeParse(undefined).success).toBe(false)
    expect(JsonValueSchema.safeParse(() => {}).success).toBe(false)
    expect(JsonValueSchema.safeParse(Symbol("x")).success).toBe(false)
    expect(JsonValueSchema.safeParse(BigInt(1)).success).toBe(false)
  })
})
