'use strict';

const objectdb = {
    todoList: {}
};

exports.row = (next) => {

    return next(null, objectdb.todoList);
};


exports.get = (id, next) => {

    return next(null, objectdb.todoList[id]);
};


exports.del = (id, next) => {

    delete objectdb.todoList[id];

    return next(null);
};


exports.add = (todo, next) => {

    objectdb.todoList[todo.id] = todo;

    return next(null);
};


exports.set = (todo, next) => {

    objectdb.todoList[todo.id] = todo;

    return next(null);
};
