import babel from "rollup-plugin-babel";
import reslove from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import { terser } from "rollup-plugin-terser";
export default [
  {
    input: "./src/use-smart.js",
    output: [
      { file: "./dist/index.js", format: "cjs" },
      {
        file: "./dist/index.es.js",
        format: "es",
        exports: "named",
      },
    ],
    plugins: [
      babel({
        exclude: [
          "node_modules/**",
          "src/**/*.stories.js",
          "src/**/*.test.js",
          ".storybook/**",
          "**/tests",
          "**/*.test.js",
        ],
        presets: ["@babel/preset-react"],
      }),
      external(),
      reslove(),
      terser(),
    ],
  },
];
