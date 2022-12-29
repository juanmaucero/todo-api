const SCHEMAS = {
    ADD_TASK_SCH: {
        $id: 'addTaskJsonBody',
        type: 'object',
        required: ['name'],
        properties: {
            name: {
                type: 'string',
                minLength: 1
            }
        }
    },
    MARK_DONE_SCH: {
        $id: 'markDoneJsonBody',
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                minLength: 1
            }
        }
    }
}

const SCHEMA_NAMES = {
    ADD_TASK: 'addTaskJsonBody#',
    MARK_DONE: 'markDoneJsonBody#'
}

export {
    SCHEMAS,
    SCHEMA_NAMES
}