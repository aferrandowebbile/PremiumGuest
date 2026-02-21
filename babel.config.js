module.exports = function (api) {
  api.cache(true);
  const isTest = process.env.BABEL_ENV === "test" || process.env.NODE_ENV === "test";

  return {
    presets: ["babel-preset-expo", !isTest && "nativewind/babel"].filter(Boolean),
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@": "./src"
          }
        }
      ]
    ].filter(Boolean)
  };
};
