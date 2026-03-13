module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard',
    'plugin:react/recommended'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
   "import/order": [
    "error",
      {
        "newlines-between": "always-and-inside-groups",
        "groups": [
          "external",
          "internal",
          "builtin",
          "parent",
          "sibling",
          "index",
          "object",
          "type"
        ],
      }
  ]
  }
}
