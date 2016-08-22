'use strict';

const TodoModel = require('../../server/method/todoModel');
const testServer = require('../testServer')();

const Code = require('code');
const Lab = require('lab');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const beforeEach = lab.beforeEach;
const describe = lab.describe;
const it = lab.it;

const testTodosDB = { todosDB: {} };
const options = { bind: testTodosDB };

testServer.method('todoModel.row', TodoModel.row, options);
testServer.method('todoModel.del', TodoModel.del, options);
testServer.method('todoModel.add', TodoModel.add, options);
testServer.method('todoModel.set', TodoModel.set, options);

const todoModel = testServer.methods.todoModel;

beforeEach((done) => {

    testTodosDB.todosDB = {};

    return done();
});

describe('server/method/todoModel.row', () => {

    it('lists all todos in an array', (done) => {

        todoModel.row('all', (err, todoList) => {

            expect(err).to.not.exist();
            expect(todoList).to.equal({
                totalTodoCount: 0,
                activeTodoCount: 0,
                completedTodoCount: 0,
                list: []
            });

            todoModel.row('active', (err, todoList) => {

                expect(err).to.not.exist();
                expect(todoList).to.equal({
                    totalTodoCount: 0,
                    activeTodoCount: 0,
                    completedTodoCount: 0,
                    list: []
                });

                todoModel.row('completed', (err, todoList) => {

                    expect(err).to.not.exist();
                    expect(todoList).to.equal({
                        totalTodoCount: 0,
                        activeTodoCount: 0,
                        completedTodoCount: 0,
                        list: []
                    });

                    testTodosDB.todosDB = {
                        someId1: { done: true, content: 'testval1' },
                        someId2: { done: false, content: 'testval2' }
                    };

                    todoModel.row('all', (err, todoList) => {

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

                        todoModel.row('active', (err, todoList) => {

                            expect(err).to.not.exist();
                            expect(todoList).to.equal({
                                totalTodoCount: 2,
                                activeTodoCount: 1,
                                completedTodoCount: 1,
                                list: [
                                    { id: 'someId2', done: false, content: 'testval2' }
                                ]
                            });

                            todoModel.row('completed', (err, todoList) => {

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

describe('server/method/todoModel.del', () => {

    it('returns an error if id is not a string', (done) => {

        todoModel.del(undefined, (err, isDeleted) => {

            expect(err).to.exist();
            expect(isDeleted).to.equal(false);

            todoModel.del(1, (err, isDeleted) => {

                expect(err).to.exist();
                expect(isDeleted).to.equal(false);

                return done();
            });
        });
    });

    it('deletes object if id exists', (done) => {

        testTodosDB.todosDB = { someId: { done: false, content: 'testval' } };

        todoModel.del('someId', (err, isDeleted) => {

            expect(err).to.not.exist();
            expect(isDeleted).to.equal(true);
            expect(testTodosDB.todosDB).to.equal({});

            return done();
        });
    });

    it('deletes all completed objects', (done) => {

        testTodosDB.todosDB = {
            someId1: { done: done, content: 'testval1' },
            someId2: { done: false, content: 'testval2' },
            someId3: { done: done, content: 'testval3' }
        };

        todoModel.del('completed', (err, isDeleted) => {

            expect(err).to.not.exist();
            expect(isDeleted).to.equal(true);
            expect(testTodosDB.todosDB).to.equal({ someId2: { done: false, content: 'testval2' } });

            return done();
        });
    });

    it('returns false if id does not exist', (done) => {

        testTodosDB.todosDB = { otherId: { done: false, content: 'testval' } };

        todoModel.del('someId', (err, isDeleted) => {

            expect(err).to.not.exist();
            expect(isDeleted).to.equal(false);
            expect(testTodosDB.todosDB).to.equal({ otherId: { done: false, content: 'testval' } });

            return done();
        });
    });
});

describe('server/method/todoModel.add', () => {

    it('returns an error if object is not valid', (done) => {

        todoModel.add({ test: true }, (err) => {

            expect(err).to.exist();
            expect(testTodosDB.todosDB).to.equal({});

            todoModel.add({ content: 888 }, (err) => {

                expect(err).to.exist();
                expect(testTodosDB.todosDB).to.equal({});

                todoModel.add({}, (err) => {

                    expect(err).to.exist();
                    expect(testTodosDB.todosDB).to.equal({});

                    return done();
                });
            });
        });
    });

    it('saves the object if it is valid', (done) => {

        todoModel.add({ content: 'test' }, (err) => {

            const keys = Object.keys(testTodosDB.todosDB);
            expect(err).to.not.exist();
            expect(testTodosDB.todosDB[keys[0]]).to.equal({ done: false, content: 'test' });

            testTodosDB.todosDB = {};

            todoModel.add({ done: true, content: 'test2' }, (err) => {

                const keys = Object.keys(testTodosDB.todosDB);
                expect(err).to.not.exist();
                expect(testTodosDB.todosDB[keys[0]]).to.equal({ done: true, content: 'test2' });

                return done();
            });
        });
    });
});

describe('server/method/todoModel.set', () => {

    it('returns an error if object is not valid', (done) => {

        testTodosDB.todosDB = { someId: { done: false, content: 'testval' } };

        todoModel.set({ done: true }, (err, isUpdated) => {

            expect(err).to.exist();
            expect(isUpdated).to.equal(false);
            expect(testTodosDB.todosDB).to.equal({ someId: { done: false, content: 'testval' } });

            todoModel.set({ id: 888 }, (err, isUpdated) => {

                expect(err).to.exist();
                expect(isUpdated).to.equal(false);
                expect(testTodosDB.todosDB).to.equal({ someId: { done: false, content: 'testval' } });

                todoModel.set({}, (err, isUpdated) => {

                    expect(err).to.exist();
                    expect(isUpdated).to.equal(false);
                    expect(testTodosDB.todosDB).to.equal({ someId: { done: false, content: 'testval' } });

                    return done();
                });
            });
        });
    });

    it('updates an object if id exists', (done) => {

        testTodosDB.todosDB = { someId: { done: false, content: 'testval' } };

        todoModel.set({ id: 'someId', content: 'valtest' }, (err, isUpdated) => {

            expect(err).to.not.exist();
            expect(isUpdated).to.equal(true);
            expect(testTodosDB.todosDB).to.equal({ someId: { done: false, content: 'valtest' } });

            todoModel.set({ id: 'someId', done: true }, (err, isUpdated) => {

                expect(err).to.not.exist();
                expect(isUpdated).to.equal(true);
                expect(testTodosDB.todosDB).to.equal({ someId: { done: true, content: 'valtest' } });

                return done();
            });
        });
    });

    it('updates all to active or completed', (done) => {

        testTodosDB.todosDB = {
            someId1: { done: false, content: 'testval1' },
            someId2: { done: false, content: 'testval2' },
            someId3: { done: true, content: 'testval3' }
        };

        todoModel.set({ id: 'all', done: true }, (err, isUpdated) => {

            expect(err).to.not.exist();
            expect(isUpdated).to.equal(true);
            expect(testTodosDB.todosDB).to.equal({
                someId1: { done: true, content: 'testval1' },
                someId2: { done: true, content: 'testval2' },
                someId3: { done: true, content: 'testval3' }
            });

            todoModel.set({ id: 'all', done: false }, (err, isUpdated) => {

                expect(err).to.not.exist();
                expect(isUpdated).to.equal(true);
                expect(testTodosDB.todosDB).to.equal({
                    someId1: { done: false, content: 'testval1' },
                    someId2: { done: false, content: 'testval2' },
                    someId3: { done: false, content: 'testval3' }
                });

                return done();
            });
        });
    });

    it('returns false if id does not exist', (done) => {

        testTodosDB.todosDB = { otherId: { done: true, content: 'test' } };

        todoModel.set({ id: 'someId', done: true, content: 'valtest' }, (err, isUpdated) => {

            expect(err).to.not.exist();
            expect(isUpdated).to.equal(false);
            expect(testTodosDB.todosDB).to.equal({ otherId: { done: true, content: 'test' } });

            return done();
        });
    });
});
