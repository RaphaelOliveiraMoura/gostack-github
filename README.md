## Configuration of style guides

> Editor Config

Right click with mouse and chose `generate .editorconfig`, and make some changes:

```shell
root = true

[*]
end_of_line = lf
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

```

> Eslint

Adding dependences:

```
  yarn add eslint -D
```

Starting configurations:

```
  yarn eslint --init
```

> prettier

Adding dependences:

```
  yarn add prettier eslint-config-prettier eslint-plugin-prettier babel-eslint -D
```

Create a file called `.prettierrc` with:

```
{
  "singleQuote": true,
  "trailingComma": "es5"
}


```

Change the file `eslintrc.js` to:

```javascript
module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ['airbnb', 'prettier', 'prettier/react'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', 'js'] }],
    'import/prefer-default-export': 'off'
  }
};
```
