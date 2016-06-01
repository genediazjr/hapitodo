'use strict';

const Context = require('acquaint');

module.exports = (rawParams, next) => {

    const params = rawParams || {};
    params.query = params.query || {};
    const model = Context.methods.model.todoModel;
    const values = {
        title: 'To Do List',
        messages: params.query.messages || []
    };

    // pagination offset limit

    return model.row((err, rows) => {

        if (err) {

            return next({
                code: 'browse_todo_error',
                message: 'To Do Browse Error'
            }, 'todoList', values);
        }

        values.list = [];

        for (const id in rows) {
            if (rows.hasOwnProperty(id)) {
                values.list.push({
                    id: id,
                    done: rows[id].done,
                    value: rows[id].value,
                    crumb: params.crumb
                });
            }
        }

        return next(null, 'todoList', values);
    });
};
