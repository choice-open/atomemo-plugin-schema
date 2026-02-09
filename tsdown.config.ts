import { defineConfig } from "tsdown"

export default defineConfig({
  dts: true,
  entry: ["src/schemas.ts", "src/types.ts"],
  exports: {
    devExports: false,
  },
  format: "esm",
  sourcemap: true,
})
