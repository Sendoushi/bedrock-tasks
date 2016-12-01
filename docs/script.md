# Bedrock: Utils > Script

Module to compile scripts.<br>
This module proxies to [webpack](https://webpack.github.io/). For general reference, you should use [webpack](https://webpack.github.io/docs/configuration.html)<br>
Follow the types used in the below configuration, otherwise you will break the compiler. If there is some data inside a string or a boolean value for example, that should be seen as the default.

### Config file parameters
```json
{
    "type": "script",
    "data": [{
        "src": "<task_src_glob>",
        "dest": "<task_dest>",
        "options": {
            "context": "",
            "entry": "",
            "output": {
                "filename": "app.js",
                "path": "",
                "publicPath": "",
                "chunkFilename": "",
                "sourceMapFilename": "",
                "devtoolModuleFilenameTemplate": "",
                "devtoolFallbackModuleFilenameTemplate": "",
                "devtoolLineToLine": false,
                "hotUpdateChunkFilename": "",
                "hotUpdateMainFilename": "",
                "jsonpFunction": "",
                "hotUpdateFunction": "",
                "pathinfo": false,
                "library": "",
                "libraryTarget": "",
                "umdNamedDefine": false,
                "sourcePrefix": "",
                "crossOriginLoading": ""
            },
            "module": {
                "preLoaders": [{
                    "test": "",
                    "loader": "",
                    "exclude": "",
                    "include": [],
                    "loaders": [""],
                    "query": ""
                }],
                "loaders": [{
                    "test": "/\\.json?$/",
                    "loader": "json-loader",
                    "exclude": "/(node_modules|bower_components)/",
                    "include": [],
                    "loaders": [""],
                    "query": ""
                }, {
                    "test": "/\\.html?$/",
                    "loader": "raw-loader",
                    "exclude": "/(node_modules|bower_components)/",
                    "include": [],
                    "loaders": [""],
                    "query": ""
                }],
                "postLoaders": [{
                    "test": "",
                    "loader": "",
                    "exclude": "",
                    "include": [],
                    "loaders": [""],
                    "query": ""
                }],
                "noParse": [""],
                "unknownContextRegExp": "",
                "unknownContextCritical": false,
                "exprContextRegExp": "",
                "exprContextCritical": false,
                "wrappedContextRegExp": "",
                "wrappedContextCritical": false
            },
            "resolve": {
                "alias": [""],
                "root": [""],
                "modulesDirectories": ["./node_modules", "./src"],
                "fallback": [""],
                "extensions": ["", ".js"],
                "packageMains": [""],
                "packageAlias": "",
                "unsafeCache": [""],
                "moduleTemplates": [""]
            },
            "resolveLoader": {
                "alias": [""],
                "root": [""],
                "modulesDirectories": ["./node_modules", "./src"],
                "fallback": [""],
                "extensions": ["", ".js"],
                "packageMains": [""],
                "packageAlias": "",
                "unsafeCache": [""],
                "moduleTemplates": [""]
            },
            "externals": {},
            "target": "web",
            "bail": true,
            "profile": false,
            "cache": true,
            "debug": false,
            "devtool": "",
            "devServer": "",
            "node": "",
            "amd": "",
            "loader": "",
            "recordsPath": "",
            "recordsInputPath": "",
            "recordsOutputPath": "",
            "plugins": [{
                "name": "<plugin_name_for_require>",
                "type": "function||class",
                "args": ["", {}]
            }]
        }
    }]
}
```

### Examples
Go under the [test/examples/script](test/examples/script), [test/examples/script/es6](test/examples/script/es6), [test/examples/script/flow](test/examples/script/flow) or [test/examples/script/typescript](test/examples/script/typescript) folders and check the `*.json`.

** Note for ES6: ** You should have installed these as dependencies to use the `config.json`: `babel-core`, `babel-loader`, `babel-plugin-transform-runtime`, `babel-preset-es2015`, `babel-preset-stage-2`
** Note for Flow: ** You should have installed these as dependencies to use the `config.json`: `flow-bin`, `flow-status-webpack-plugin`, `babel-core`, `babel-loader`, `babel-plugin-transform-flow-strip-types`
** Note for Typescript: ** You should have installed these as dependencies to use the `config.json`: `flow-bin`, `typescript`, `ts-loader`, `webpack-fail-plugin` 
