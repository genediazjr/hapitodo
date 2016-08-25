'use strict';

const testServer = require('../../testServer')();

const Proxyquire = require('proxyquire');
const Code = require('code');
const Lab = require('lab');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const beforeEach = lab.beforeEach;
const describe = lab.describe;
const it = lab.it;

let connErr = false;
let isDone = false;
let query = (query, queryNext) => {

    return queryNext();
};

const stub = {
    pg: {
        native: {
            connect: (connStr, connNext) => {

                return connNext(connErr, { query: query }, () => {

                    isDone = true;
                });
            }
        }
    }
};

const TodoModel = Proxyquire('../../../server/method/postgres/todoModel', stub);
const options = { bind: { connectionString: 'someString' } };

testServer.method('todoModel.row', TodoModel.row, options);
testServer.method('todoModel.del', TodoModel.del, options);
testServer.method('todoModel.add', TodoModel.add, options);
testServer.method('todoModel.set', TodoModel.set, options);

const todoModel = testServer.methods.todoModel;

beforeEach((done) => {

    connErr = false;
    isDone = false;
    query = (query, queryNext) => {

        return queryNext();
    };

    return done();
});

describe('server/method/postgres/todoModel', () => {

    it('throws on connection error', (done) => {

        connErr = new Error('connError');

        expect(() => {

            Proxyquire('../../../server/method/postgres/todoModel', stub);
        }).to.throw(/connError/);

        expect(isDone).to.equal(true);

        return done();
    });

    it('throws on query error', (done) => {

        query = (query, queryNext) => {

            return queryNext(new Error('queryError'));
        };

        expect(() => {

            Proxyquire('../../../server/method/postgres/todoModel', stub);
        }).to.throw(/queryError/);

        expect(isDone).to.equal(true);

        return done();
    });
});

describe('server/method/postgres/todoModel.row', () => {

    it('returns an error on connection error', (done) => {

        connErr = true;

        todoModel.row('all', (err, todoList) => {

            expect(isDone).to.equal(false);
            expect(err).to.exist();
            expect(todoList).to.not.exist();

            isDone = false;

            todoModel.row('active', (err, todoList) => {

                expect(isDone).to.equal(false);
                expect(err).to.exist();
                expect(todoList).to.not.exist();

                isDone = false;

                todoModel.row('completed', (err, todoList) => {

                    expect(isDone).to.equal(false);
                    expect(err).to.exist();
                    expect(todoList).to.not.exist();

                    return done();
                });
            });
        });
    });

    it('returns an error on query error', (done) => {

        query = (query, queryNext) => {

            let queryErr = false;

            if (query === 'SELECT COUNT(*) FROM todos') {
                queryErr = true;
            }

            return queryNext(queryErr, { rows: [{ count: 0 }] });
        };

        todoModel.row('all', (err, todoList) => {

            expect(isDone).to.equal(true);
            expect(err).to.exist();
            expect(todoList).to.not.exist();

            isDone = false;

            query = (query, queryNext) => {

                let queryErr = false;

                if (query === 'SELECT COUNT(*) FROM todos WHERE done = false') {
                    queryErr = true;
                }

                return queryNext(queryErr, { rows: [{ count: 0 }] });
            };

            todoModel.row('all', (err, todoList) => {

                expect(isDone).to.equal(true);
                expect(err).to.exist();
                expect(todoList).to.not.exist();

                isDone = false;

                query = (query, queryNext) => {

                    let queryErr = false;

                    if (query === 'SELECT * FROM todos ORDER BY id DESC') {
                        queryErr = true;
                    }

                    return queryNext(queryErr, { rows: [{ count: 0 }] });
                };

                todoModel.row('all', (err, todoList) => {

                    expect(isDone).to.equal(true);
                    expect(err).to.exist();
                    expect(todoList).to.not.exist();

                    return done();
                });
            });
        });
    });

    it('lists all todos in an array', (done) => {

        query = (query, queryNext) => {

            let queryResult;

            if (query === 'SELECT * FROM todos ORDER BY id DESC') {
                queryResult = { rows: [] };
            }
            else if (query === 'SELECT * FROM todos WHERE done = true ORDER BY id DESC') {
                queryResult = { rows: [] };
            }
            else if (query === 'SELECT * FROM todos WHERE done = false ORDER BY id DESC') {
                queryResult = { rows: [] };
            }
            else if (query === 'SELECT COUNT(*) FROM todos WHERE done = false') {
                queryResult = { rows: [{ count: 0 }] };
            }
            else if (query === 'SELECT COUNT(*) FROM todos') {
                queryResult = { rows: [{ count: 0 }] };
            }

            return queryNext(null, queryResult);
        };

        todoModel.row('all', (err, todoList) => {

            expect(isDone).to.be.true();
            expect(err).to.not.exist();
            expect(todoList).to.equal({
                totalTodoCount: 0,
                activeTodoCount: 0,
                completedTodoCount: 0,
                list: []
            });

            isDone = false;

            todoModel.row('active', (err, todoList) => {

                expect(isDone).to.be.true();
                expect(err).to.not.exist();
                expect(todoList).to.equal({
                    totalTodoCount: 0,
                    activeTodoCount: 0,
                    completedTodoCount: 0,
                    list: []
                });

                isDone = false;

                todoModel.row('completed', (err, todoList) => {

                    expect(isDone).to.be.true();
                    expect(err).to.not.exist();
                    expect(todoList).to.equal({
                        totalTodoCount: 0,
                        activeTodoCount: 0,
                        completedTodoCount: 0,
                        list: []
                    });

                    query = (query, queryNext) => {

                        let queryResult;

                        if (query === 'SELECT * FROM todos ORDER BY id DESC') {
                            queryResult = {
                                rows: [
                                    { id: 'someId1', done: true, content: 'testval1' },
                                    { id: 'someId2', done: false, content: 'testval2' }
                                ]
                            };
                        }
                        else if (query === 'SELECT * FROM todos WHERE done = true ORDER BY id DESC') {
                            queryResult = { rows: [{ id: 'someId1', done: true, content: 'testval1' }] };
                        }
                        else if (query === 'SELECT * FROM todos WHERE done = false ORDER BY id DESC') {
                            queryResult = { rows: [{ id: 'someId2', done: false, content: 'testval2' }] };
                        }
                        else if (query === 'SELECT COUNT(*) FROM todos WHERE done = false') {
                            queryResult = { rows: [{ count: 1 }] };
                        }
                        else if (query === 'SELECT COUNT(*) FROM todos') {
                            queryResult = { rows: [{ count: 2 }] };
                        }

                        return queryNext(null, queryResult);
                    };

                    todoModel.row('all', (err, todoList) => {

                        expect(isDone).to.be.true();
                        expect(err).to.not.exist();
                        expect(todoList).to.equal({
                            totalTodoCount: 2,
                            activeTodoCount: 1,
                            completedTodoCount: 1,
                            list: [
                                { id: 'someId1', done: true, content: 'testval1' },
                                { id: 'someId2', done: false, content: 'testval2' }
                            ]
                        });

                        isDone = false;

                        todoModel.row('active', (err, todoList) => {

                            expect(isDone).to.be.true();
                            expect(err).to.not.exist();
                            expect(todoList).to.equal({
                                totalTodoCount: 2,
                                activeTodoCount: 1,
                                completedTodoCount: 1,
                                list: [
                                    { id: 'someId2', done: false, content: 'testval2' }
                                ]
                            });

                            isDone = false;

                            todoModel.row('completed', (err, todoList) => {

                                expect(isDone).to.be.true();
                                expect(err).to.not.exist();
                                expect(todoList).to.equal({
                                    totalTodoCount: 2,
                                    activeTodoCount: 1,
                                    completedTodoCount: 1,
                                    list: [
                                        { id: 'someId1', done: true, content: 'testval1' }
                                    ]
                                });

                                return done();
                            });
                        });
                    });
                });
            });
        });
    });
});

describe('server/method/postgres/todoModel.del', () => {

    it('returns an error on connection error', (done) => {

        connErr = true;

        todoModel.del('someId', (err, isDeleted) => {

            expect(err).to.exist();
            expect(isDeleted).to.equal(false);
            expect(isDone).to.equal(true);

            return done();
        });
    });

    it('returns an error on query error', (done) => {

        query = (query, queryNext) => {

            return queryNext(true);
        };

        todoModel.del('someId', (err, isDeleted) => {

            expect(err).to.exist();
            expect(isDeleted).to.equal(false);
            expect(isDone).to.equal(true);

            return done();
        });
    });

    it('returns an error if id is not a string', (done) => {

        todoModel.del(undefined, (err, isDeleted) => {

            expect(err).to.exist();
            expect(isDeleted).to.equal(false);
            expect(isDone).to.equal(false);

            todoModel.del(1, (err, isDeleted) => {

                expect(err).to.exist();
                expect(isDeleted).to.equal(false);
                expect(isDone).to.equal(false);

                return done();
            });
        });
    });

    it('deletes one id', (done) => {

        query = (query, queryNext) => {

            expect(query.text).to.be.equal('DELETE FROM todos WHERE id = $1');
            expect(query.values[0]).to.be.equal('someId');

            return queryNext(null, { rowCount: 1 });
        };

        todoModel.del('someId', (err, isDeleted) => {

            expect(err).to.not.exist();
            expect(isDeleted).to.equal(1);
            expect(isDone).to.equal(true);

            return done();
        });
    });

    it('deletes all completed', (done) => {

        query = (query, queryNext) => {

            expect(query).to.be.equal('DELETE FROM todos WHERE done = true');

            return queryNext(null, { rowCount: 1 });
        };

        todoModel.del('completed', (err, isDeleted) => {

            expect(err).to.not.exist();
            expect(isDeleted).to.equal(1);
            expect(isDone).to.equal(true);

            return done();
        });
    });

    it('returns 0 if id does not exist', (done) => {

        query = (query, queryNext) => {

            expect(query.text).to.be.equal('DELETE FROM todos WHERE id = $1');
            expect(query.values[0]).to.be.equal('someId');

            return queryNext(null, { rowCount: 0 });
        };

        todoModel.del('someId', (err, isDeleted) => {

            expect(err).to.not.exist();
            expect(isDeleted).to.equal(0);
            expect(isDone).to.equal(true);

            return done();
        });
    });
});

describe('server/method/postgres/todoModel.add', () => {

    it('returns an error on connection error', (done) => {

        connErr = true;

        todoModel.add({ done: true, content: 'test2' }, (err, id) => {

            expect(id).to.not.exist();
            expect(err).to.exist();
            expect(isDone).to.equal(true);

            return done();
        });
    });

    it('returns an error on query error', (done) => {

        query = (query, queryNext) => {

            return queryNext(true);
        };

        todoModel.add({ done: true, content: 'test2' }, (err, id) => {

            expect(id).to.not.exist();
            expect(err).to.exist();
            expect(isDone).to.equal(true);

            return done();
        });
    });

    it('returns an error if object is not valid', (done) => {

        todoModel.add({ test: true }, (err) => {

            expect(err).to.exist();
            expect(isDone).to.equal(false);

            todoModel.add({ content: 888 }, (err) => {

                expect(err).to.exist();
                expect(isDone).to.equal(false);

                todoModel.add({}, (err) => {

                    expect(err).to.exist();
                    expect(isDone).to.equal(false);

                    return done();
                });
            });
        });
    });

    it('saves the object if it is valid', (done) => {

        query = (query, queryNext) => {

            expect(query.text).to.be.equal('INSERT INTO todos (content, done) VALUES ($1, $2) RETURNING id');
            expect(query.values).to.be.equal(['test', false]);

            return queryNext(null, { rows: [{ id: 1 }] });
        };

        todoModel.add({ content: 'test' }, (err, id) => {

            expect(id).to.equal(1);
            expect(err).to.not.exist();
            expect(isDone).to.equal(true);

            query = (query, queryNext) => {

                expect(query.text).to.be.equal('INSERT INTO todos (content, done) VALUES ($1, $2) RETURNING id');
                expect(query.values).to.be.equal(['test2', true]);

                return queryNext(null, { rows: [{ id: 2 }] });
            };

            todoModel.add({ done: true, content: 'test2' }, (err, id) => {

                expect(id).to.equal(2);
                expect(err).to.not.exist();
                expect(isDone).to.equal(true);

                return done();
            });
        });
    });
});

describe('server/method/postgres/todoModel.set', () => {

    it('returns an error on connection error', (done) => {

        connErr = true;

        todoModel.set({ id: 'someId', done: true }, (err, isUpdated) => {

            expect(err).to.exist();
            expect(isUpdated).to.equal(false);
            expect(isDone).to.equal(true);

            return done();
        });
    });

    it('returns an error on query error', (done) => {

        query = (query, queryNext) => {

            return queryNext(true);
        };

        todoModel.set({ id: 'someId', done: true }, (err, isUpdated) => {

            expect(err).to.exist();
            expect(isUpdated).to.equal(false);
            expect(isDone).to.equal(true);

            return done();
        });
    });

    it('returns an error if object is not valid', (done) => {

        todoModel.set({ done: true }, (err, isUpdated) => {

            expect(err).to.exist();
            expect(isUpdated).to.equal(false);
            expect(isDone).to.equal(false);

            todoModel.set({ id: 888 }, (err, isUpdated) => {

                expect(err).to.exist();
                expect(isUpdated).to.equal(false);
                expect(isDone).to.equal(false);

                todoModel.set({}, (err, isUpdated) => {

                    expect(err).to.exist();
                    expect(isUpdated).to.equal(false);
                    expect(isDone).to.equal(false);

                    return done();
                });
            });
        });
    });

    it('updates object', (done) => {

        query = (query, queryNext) => {

            expect(query.text).to.be.equal('UPDATE todos SET content = $1 WHERE id = $2');
            expect(query.values).to.be.equal(['valtest', 'someId']);

            return queryNext(null, { rowCount: 1 });
        };

        todoModel.set({ id: 'someId', content: 'valtest' }, (err, isUpdated) => {

            expect(err).to.not.exist();
            expect(isUpdated).to.equal(1);
            expect(isDone).to.equal(true);

            query = (query, queryNext) => {

                expect(query.text).to.be.equal('UPDATE todos SET done = $1 WHERE id = $2');
                expect(query.values).to.be.equal([true, 'someId']);

                return queryNext(null, { rowCount: 1 });
            };

            todoModel.set({ id: 'someId', done: true }, (err, isUpdated) => {

                expect(err).to.not.exist();
                expect(isUpdated).to.equal(1);
                expect(isDone).to.equal(true);

                return done();
            });
        });
    });

    it('updates all to active or completed', (done) => {

        query = (query, queryNext) => {

            expect(query.text).to.be.equal('UPDATE todos SET done = $1');
            expect(query.values).to.be.equal([true]);

            return queryNext(null, { rowCount: 1 });
        };

        todoModel.set({ id: 'all', done: true }, (err, isUpdated) => {

            expect(err).to.not.exist();
            expect(isUpdated).to.equal(1);
            expect(isDone).to.equal(true);

            query = (query, queryNext) => {

                expect(query.text).to.be.equal('UPDATE todos SET done = $1');
                expect(query.values).to.be.equal([false]);

                return queryNext(null, { rowCount: 1 });
            };

            todoModel.set({ id: 'all', done: false }, (err, isUpdated) => {

                expect(err).to.not.exist();
                expect(isUpdated).to.equal(1);
                expect(isDone).to.equal(true);

                return done();
            });
        });
    });

    it('returns false if id does not exist', (done) => {

        query = (query, queryNext) => {

            expect(query.text).to.be.equal('UPDATE todos SET content = $1 done = $2 WHERE id = $3');
            expect(query.values).to.be.equal(['valtest', true, 'someId']);

            return queryNext(null, { rowCount: 0 });
        };

        todoModel.set({ id: 'someId', done: true, content: 'valtest' }, (err, isUpdated) => {

            expect(err).to.not.exist();
            expect(isUpdated).to.equal(0);
            expect(isDone).to.equal(true);

            return done();
        });
    });
});
