module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2017
    },
    "globals": {
        "__basedir": true,
        "process": false,
        "__dirname": false
    },
    "rules": {
        "indent": "off",
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": "off",
        "semi": "off",
        "no-unused-vars": ["warn", {"args" : "none"}],
    }
};