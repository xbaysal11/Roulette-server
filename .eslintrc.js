module.exports = {
    env: {
        es6: true,
        node: true
    },
    extends: ["eslint:recommended", "plugin:prettier/recommended"],
    plugins: ["prettier"],
    parserOptions: {
        ecmaVersion: 2015
    },
    rules: {
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "no-console": ["off"],
        "no-debugger": ["off"]
    }
};
