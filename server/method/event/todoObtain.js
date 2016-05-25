'use strict';

const Context = require('acquaint');

module.exports = (params, next) => {

    params = params || {};
    params.query = params.query || {};
    const model = Context.methods.model.todoModel;
    const values = {
        title: 'New To Do',
        messages: params.query.messages || [],
        methodFallback: 'create'
    };

    if (!params.id) {

        return next(null, 'todoItem', values);
    }

    return model.get(params.id, (err, todo) => {

        if (err) {

            return next({
                code: 'obtain_todo_error',
                message: 'To Do Obtain Error'
            }, 'todoItem', values);
        }

        if (!todo) {

            return next({
                code: 'obtain_id_unidentified',
                message: 'To Do Item does not exist'
            }, 'todoItem', values);
        }

        values.title = 'To Do ' + todo.value;
        values.item = todo;
        values.methodFallback = 'update';

        return next(null, 'todoItem', values);
    });
};
