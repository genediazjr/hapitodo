'use strict';

const UUID = require('node-uuid');
const Context = require('acquaint');

module.exports = (payload, next) => {

    payload = payload || {};
    const model = Context.methods.model.todoModel;
    const values = {
        title: 'New To Do',
        messages: []
    };

    payload.value = payload.value.trim();

    if (!payload.value) {

        return next({
            code: 'create_missing_parameter',
            message: 'Value parameter is required'
        }, '/todo', values);
    }

    if (payload.done === 'on') {
        payload.done = true;
    }

    if (payload.done === 'off' || !payload.done) {
        payload.done = false;
    }

    const todo = {
        id: UUID.v4().replace(/-/g, ''),
        done: payload.done,
        value: payload.value
    };

    return model.add(todo, (err) => {

        if (err) {

            return next({
                code: 'create_todo_error',
                message: 'To Do Save Error'
            }, '/todo', values);
        }

        values.messages.push({
            type: 'success',
            code: 'create_success',
            message: 'To Do Saved'
        });

        return next(null, '/todo/list', values);
    });
};
