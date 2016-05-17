'use strict';

const Context = require('acquaint');

module.exports = (payload, next) => {

    payload = payload || {};
    const model = Context.methods.model.todoObject;
    const values = {
        title: 'Edit To Do',
        messages: []
    };

    payload.value = payload.value.trim();

    if (!payload.id) {

        return next({
            code: 'update_missing_parameter_id',
            message: 'Id parameter is required'
        }, '/todo/list', values);
    }

    if (!payload.value) {

        return next({
            code: 'update_missing_parameter_value',
            message: 'Value parameter is required'
        }, '/todo', values);
    }

    return model.get(payload.id, (err, todo) => {

        if (err) {

            return next({
                code: 'update_obtain_todo_error',
                message: 'To Do Remove Error'
            }, '/todo/' + payload.id, values);
        }

        if (!todo) {

            return next({
                code: 'update_id_unidentified',
                message: 'To Do Item does not exist'
            }, '/todo/', values);
        }

        if (payload.id && !payload.done && !payload.value) {
            payload.done = !todo.done;
            payload.value = todo.value;
        }

        if (payload.done === 'on') {
            payload.done = true;
        }

        if (payload.done === 'off' || !payload.done) {
            payload.done = false;
        }

        return model.set(payload, (err) => {

            if (err) {

                return next({
                    code: 'update_todo_error',
                    message: 'To Do Update Error'
                }, '/todo/' + payload.id, values);
            }

            values.messages.push({
                type: 'success',
                code: 'update_success',
                message: 'To Do Updated'
            });

            return next(null, '/todo/list', values);
        });

    });
};
