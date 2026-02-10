import { defineConfig } from "tsdown"

export default defineConfig({
  dts: true,
  entry: ["src/schemas.ts", "src/types.ts"],
  exports: {
    devExports: "development",
  },
  format: "esm",
  sourcemap: true,
})
