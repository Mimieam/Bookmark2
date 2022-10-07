module.exports = {
  "parser": "babel-eslint",
  "env": {
      "es6": true,
      "node": true,
      "browser": true
    },
    "globals": {
      "chrome": true
    },
    "parserOptions": {
      "ecmaVersion": 8,
      "sourceType": "module"
    },
    "extends": [
      "eslint:recommended", "airbnb"
    ],
    "rules": {
      // Indent with 4 spaces
      "indent": ["error", 4],
       "no-unused-expressions": ["error", { "allowShortCircuit": true }],
      "comma-dangle": ["error", "never"],
      camelcase:0,
      "no-param-reassign": ["error", { "props": false }],
      "no-prototype-builtins":0,

      "no-underscore-dangle":0,
       "no-unused-vars": ["error", { "vars": "all", "args": "none", "ignoreRestSiblings": true }],
      "max-len":0,
      "strict": 0,
      "semi": 0,
      "no-console": 0,
      "eol-last": 0,
      "quotes": [
        2,
        "single"
      ]
    },
    "settings": {
      "react": {
        "version": "999.999.999"
      }
  }
}
