// rollup.config.js
//
// 스캐폴드 기본 설정은 babel + rollup-plugin-typescript2 조합이라 .ts 를 그대로 흘려보냈다.
// 같은 저장소에 있는 tiptap-extension-resize-image 와 맞춰 @rollup/plugin-typescript 를 쓴다.
// 타입 선언(dist/index.d.ts)은 package.json 의 build:types 에서 tsc 가 따로 만든다.

const { nodeResolve } = require("@rollup/plugin-node-resolve");
const typescript = require("@rollup/plugin-typescript");

const config = {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
    {
      file: "dist/index.js",
      format: "esm",
      exports: "named",
      sourcemap: true,
    },
  ],
  external: ["@tiptap/core", "@tiptap/pm", "tslib"],
  plugins: [
    typescript({
      tsconfig: false,
      compilerOptions: {
        target: "es6",
        module: "ESNext",
        moduleResolution: "node",
        esModuleInterop: true,
        lib: ["es5", "es6", "dom"],
        declaration: false,
        declarationMap: false,
        sourceMap: true,
      },
    }),
    nodeResolve({
      extensions: [".mjs", ".js", ".json", ".ts"],
    }),
  ],
};

module.exports = config;
