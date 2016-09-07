'use strict';

const Joi = require('joi');
const Postgres = require('pg').native;
const Manifest = require('../../manifest');
const todoSchema = require('../../schemas').todoSchema;

Postgres.connect(Manifest.defaults.connectionString, (connErr, client, done) => {

    if (connErr) {
        done();

        throw connErr;
    }

    client.query(`
        CREATE TABLE IF NOT EXISTS todos (
            id      SERIAL PRIMARY KEY,
            done    BOOLEAN NOT NULL,
            content TEXT NOT NULL
        )
    `, (queryErr) => {

        done();

        if (queryErr) {

            throw queryErr;
        }
    });
});


exports.row = function (filter, next) {

    Postgres.connect(this.connectionString, (connErr, client, done) => {

        if (connErr) {

            return next(connErr);
        }

        let query = '';

        if (filter === 'completed') {
            query = ' WHERE done = true';
        }
        else if (filter === 'active') {
            query = ' WHERE done = false';
        }

        client.query(`SELECT * FROM todos${query} ORDER BY id DESC`, (queryErr, result) => {

            if (queryErr) {
                done();

                return next(queryErr);
            }

            client.query(`SELECT COUNT(*) FROM todos WHERE done = false`, (queryErrActive, resultActive) => {

                if (queryErrActive) {
                    done();

                    return next(queryErrActive);
                }

                client.query(`SELECT COUNT(*) FROM todos`, (queryErrTotal, resultTotal) => {

                    done();

                    if (queryErrTotal) {

                        return next(queryErrTotal);
                    }

                    const totalTodo = parseInt(resultTotal.rows[0].count);
                    const activeTodo = parseInt(resultActive.rows[0].count);

                    return next(null, {
                        totalTodoCount: totalTodo,
                        activeTodoCount: activeTodo,
                        completedTodoCount: totalTodo - activeTodo,
                        list: result.rows
                    });
                });
            });
        });
    });
};


exports.del = function (id, next) {

    const err = Joi.string().validate(id || null).error;

    if (err) {

        return next(err, false);
    }

    let query = {
        text: 'DELETE FROM todos WHERE id = $1',
        values: [id]
    };

    if (id === 'completed') {
        query = 'DELETE FROM todos WHERE done = true';
    }

    Postgres.connect(this.connectionString, (connErr, client, done) => {

        if (connErr) {
            done();

            return next(connErr, false);
        }

        client.query(query, (queryErr, result) => {

            done();

            if (queryErr) {

                return next(queryErr, false);
            }

            return next(null, result.rowCount);
        });
    });
};


exports.add = function (todo, next) {

    const requireContent = todoSchema.requiredKeys('content');
    const err = requireContent.validate(todo).error;

    if (err) {

        return next(err);
    }

    Postgres.connect(this.connectionString, (connErr, client, done) => {

        if (connErr) {
            done();

            return next(connErr);
        }

        client.query({
            text: 'INSERT INTO todos (content, done) VALUES ($1, $2) RETURNING id',
            values: [todo.content, todo.done || false]
        }, (queryErr, result) => {

            done();

            if (queryErr) {

                return next(queryErr);
            }

            return next(null, result.rows[0].id);
        });
    });
};


exports.set = function (todo, next) {

    const requireId = todoSchema.requiredKeys('id').or('done', 'content');
    const err = requireId.validate(todo).error;

    if (err) {

        return next(err, false);
    }

    Postgres.connect(this.connectionString, (connErr, client, done) => {

        if (connErr) {
            done();

            return next(connErr, false);
        }

        const queryValues = [];
        let queryText = 'UPDATE todos SET';
        let query = {
            text: 'UPDATE todos SET done = $1',
            values: [todo.done]
        };

        if (Object.prototype.hasOwnProperty.call(todo, 'content')) {
            queryValues.push(todo.content);
            queryText = `${queryText} content = $${queryValues.length}`;
        }

        if (Object.prototype.hasOwnProperty.call(todo, 'done')) {
            queryValues.push(todo.done);
            queryText = `${queryText} done = $${queryValues.length}`;
        }

        if (todo.id !== 'all') {
            queryValues.push(todo.id);
            query = {
                text: `${queryText} WHERE id = $${queryValues.length}`,
                values: queryValues
            };
        }

        client.query(query, (queryErr, result) => {

            done();

            if (queryErr) {

                return next(queryErr, false);
            }

            return next(null, result.rowCount);
        });
    });
};
