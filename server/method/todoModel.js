'use strict';

const Joi = require('joi');
const Confidence = require('confidence');
const todoSchema = require('../schemas').todoSchema;


exports.row = function (filter, next) {

    const ids = Object.keys(this.todosDB);
    const todos = {
        totalTodoCount: ids.length,
        activeTodoCount: 0,
        completedTodoCount: 0,
        list: []
    };

    for (let i = 0; i < ids.length; ++i) {
        const todo = this.todosDB[ids[i]];
        todo.id = ids[i];

        if (todo.done) {
            ++todos.completedTodoCount;
        }
        else {
            ++todos.activeTodoCount;
        }

        if (filter === 'all'
            || (filter === 'active' && !todo.done)
            || (filter === 'completed' && todo.done)) {
            todos.list.push(todo);
        }
    }

    return next(null, todos);
};


exports.del = function (id, next) {

    const err = Joi.string().validate(id || null).error;
    let isDeleted = false;

    if (!err) {
        if (this.todosDB[id]) {
            delete this.todosDB[id];
            isDeleted = true;
        }
        else if (id === 'completed') {
            const ids = Object.keys(this.todosDB);
            for (let i = 0; i < ids.length; ++i) {
                const todo = [ids[i]];
                if (this.todosDB[todo].done) {
                    delete this.todosDB[todo];
                }
            }
            isDeleted = true;
        }
    }

    return next(err, isDeleted);
};


exports.add = function (todo, next) {

    const requireContent = todoSchema.requiredKeys('content');
    const err = requireContent.validate(todo).error;
    const id = Confidence.id.generate().replace(/-/g, '');

    if (!err) {
        this.todosDB[id] = {
            done: todo.done || false,
            content: todo.content
        };
    }

    return next(err, id);
};


exports.set = function (todo, next) {

    const requireId = todoSchema.requiredKeys('id');
    const err = requireId.validate(todo).error;
    let isUpdated = false;

    if (!err) {
        if (this.todosDB[todo.id]) {
            if (todo.hasOwnProperty('done')) {
                this.todosDB[todo.id].done = todo.done;
            }
            if (todo.hasOwnProperty('content')) {
                this.todosDB[todo.id].content = todo.content;
            }
            isUpdated = true;
        }
        else if (todo.id === 'all' && todo.hasOwnProperty('done')) {
            const ids = Object.keys(this.todosDB);
            for (let i = 0; i < ids.length; ++i) {
                this.todosDB[ids[i]].done = todo.done;
            }
            isUpdated = true;
        }
    }

    return next(err, isUpdated);
};
