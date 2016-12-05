# Bedrock: Tasks

Tasks to use on the frontend.

[![Build Status](https://travis-ci.org/Sendoushi/bedrock-tasks.svg?branch=master)](https://travis-ci.org/Sendoushi/bedrock-tasks)

## Installation
You need to have [node](http://nodejs.org) so you can have the package dependency management and use the tasks:
- Install [node](http://nodejs.org)

```
cd <project_folder>
npm init # If you don't have a package.json already
npm install --save git://github.com/Sendoushi/bedrock-tasks.git#0.0.1
```

## Tasks

Set a `.build.json` and run all the tasks you want when you pass it to `bedrock-tasks`.<br>
**Note:** Any kind of path should be absolute or relative to the place the script is called.

### Usage

```js
var bedrockTasks = require('bedrock-tasks');
var config = bedrockTasks({
    projectId: "bedrock-project",
    projectName: "Bedrock Project",
    tasks: []
});
var env = 'dev';
var cb = function (err) {
    if (err) {
        throw err;
    }
    
    console.log("Task concluded");
};

// Now for the tasks
suite.run('clean', config, env, cb);
suite.run('styleguide', config, env, cb);
suite.run('sprite', config, env, cb);
suite.run('copy', config, env, cb);
suite.run('style', config, env, cb);
suite.run('script', config, env, cb);
```

#### Gulp Usage

```
node <gulp_path> --gulpfile=<bedrock_tasks_gulpfile> <task> --env=<task_env> --config=<config_src>
```

- `<gulp_path>`: Pass the path to `gulp`. From example `node_modules/.bin/gulp`. You could simply use `gulp` instead if you have it globally.
- `<bedrock_tasks_gulpfile>`: Set the path for the `bedrock-tasks` gulpfile. It should be under `node_modules/bedrock-tasks/runner/gulpfile.js`. It is required.
- `<task_env>`: Environment in which the task should run. It is optional.

##### Example

```sh
node ./node_modules/.bin/gulp --gulpfile="./node_modules/bedrock-tasks/runner/gulpfile.js" build --env=prod --config=".build.json"
```

------------------------

## Configure

This repo relies on usage of `*.json` config files. Below I try to explain the best I can how to.

### Config file parameters
```json
{
    "projectId": "<project_id>",
    "projectName": "<project_name>",
    "tasks": []
}
```

### Task common config
```json
{
    "tasks": [{
        "type": "<task_type>",
        "env": "<environment>",
        "data": []
    }]    
}
```
**Note: ** If `env` key is `*`, the task will run in all `env`.

### Task data common config
```json
{
    "data": [{
        "src": "<task_src_glob>",
        "dest": "<task_dest>"
    }]    
}
```

### Module list
- [clean](docs/file_clean.md)
- [copy](docs/file_copy.md)
- [sprite](docs/sprite.md)
- [styleguide](docs/styleguide.md)
- [style](docs/style.md)
- [script](docs/script.md)

### Examples
Go under the [test/examples](test/examples) folder and check the `*.json`.
