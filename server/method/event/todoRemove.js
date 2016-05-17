'use strict';

const Context = require('acquaint');

module.exports = (params, next) => {

    params = params || {};
    const model = Context.methods.model.todoObject;
    const values = {
        title: 'Delete To Do',
        messages: []
    };

    if (!params.id) {

        return next({
            code: 'remove_missing_parameter',
            message: 'Id parameter is required'
        }, '/todo/list', values);
    }

    return model.get(params.id, (err, todo) => {

        if (err) {

            return next({
                code: 'remove_obtain_todo_error',
                message: 'To Do Remove Error'
            }, '/todo/list', values);
        }

        if (!todo) {

            return next({
                code: 'remove_id_unidentified',
                message: 'To Do Item does not exist'
            }, '/todo/list', values);
        }

        return model.del(params.id, (err) => {

            if (err) {

                return next({
                    code: 'remove_todo_error',
                    message: 'To Do Remove Error'
                }, '/todo/list', values);
            }

            values.messages.push({
                type: 'success',
                code: 'remove_success',
                message: 'To Do Removed'
            });

            return next(null, '/todo/list', values);
        });
    });
};
