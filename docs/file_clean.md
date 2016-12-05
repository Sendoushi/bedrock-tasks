# Bedrock: Utils > File: Clean

Module to remove files / folders.

### Config file parameters
```json
{
    "type": "clean",
    "data": [{
        "src": "<task_src_glob>",
        "ignore": "<task_src_glob>"
    }]    
}
```

`src` and `ignore` can be an array.

### Examples
Go under the [test/examples/clean_copy](test/examples/clean_copy) folder and check the `*.json`.
