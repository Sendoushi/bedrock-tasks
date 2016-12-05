# Bedrock: Utils > File: Copy

Module to copy files / folder.

### Config file parameters
```json
{
    "type": "copy",
    "data": [{
        "src": "<task_src_glob>",
        "dest": "<task_dest>",
        "ignore": "<task_src_glob>"
    }]    
}
```

`src` and `ignore` can be an array.

### Examples
Go under the [test/examples/clean_copy](test/examples/clean_copy) folder and check the `*.json`.
