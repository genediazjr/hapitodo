'use strict';

const Joi = require('joi');
const Confidence = require('confidence');
const todoSchema = require('../schemas').todoSchema;


exports.row = function (next) {

    const ids = Object.keys(this.todosDB);
    const todoList = [];

    for (let i = 0; i < ids.length; ++i) {
        const todo = this.todosDB[ids[i]];
        todo.id = ids[i];
        todoList.push(todo);
    }

    return next(null, todoList);
};


exports.get = function (id, next) {

    const err = Joi.string().validate(id || null).error;

    return next(err, this.todosDB[id]);
};


exports.del = function (id, next) {

    const err = Joi.string().validate(id || null).error;
    let isDeleted = false;

    if (!err && this.todosDB[id]) {
        delete this.todosDB[id];
        isDeleted = true;
    }

    return next(err, isDeleted);
};


exports.add = function (todo, next) {

    const requireContent = todoSchema.requiredKeys('content');
    const err = requireContent.validate(todo).error;

    if (!err) {
        const id = Confidence.id.generate().replace(/-/g, '');
        this.todosDB[id] = {
            done: todo.done || false,
            content: todo.content
        };
    }

    return next(err);
};


exports.set = function (todo, next) {

    const requireId = todoSchema.requiredKeys('id');
    const err = requireId.validate(todo).error;
    let isUpdated = false;

    if (!err && this.todosDB[todo.id]) {
        if (todo.hasOwnProperty('done')) {
            this.todosDB[todo.id].done = todo.done;
        }
        if (todo.hasOwnProperty('content')) {
            this.todosDB[todo.id].content = todo.content;
        }
        isUpdated = true;
    }

    return next(err, isUpdated);
};
