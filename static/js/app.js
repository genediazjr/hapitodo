'use strict';

jQuery(($) => {

    Handlebars.registerHelper('eq', function (a, b, options) {

        return a === b ? options.fn(this) : options.inverse(this);
    });

    const ESCAPE_KEY = 27;
    const ENTER_KEY = 13;
    const REST_API = '/api/v1/todo';

    const App = {
        init: function () {

            this.todoTemplate = Handlebars.templates.todo;
            this.menuTemplate = Handlebars.templates.menu;

            new Router({
                '/:filter': function (filter) {
                    this.todoFilter(filter);
                    this.filter = filter;
                }.bind(this)
            }).init('/all');

            $('#new-todo').on('keyup', this.todoAdd.bind(this));
            $('#toggle-all').on('change', this.todoToggleAll.bind(this));
            $('#todo-list')
                .on('change', '.done', this.todoToggle.bind(this))
                .on('dblclick', 'label', this.todoEditStart.bind(this))
                .on('focusout', '.edit', this.todoEditStop.bind(this))
                .on('keyup', '.edit', this.todoEditGoing.bind(this))
                .on('click', '.remove', this.todoDelete.bind(this));
            $('#menu').on('click', '#clear-completed', this.todoDeleteCompleted.bind(this));
        },
        todoFilter: function (filter) {

            this.restBrowse(filter, (data) => {

                $('#new-todo').focus();
                $('#todo-list').html(this.todoTemplate(data.list));
                $('#toggle-all').prop('checked', data.activeTodoCount === 0);
                $('#main').toggle(data.totalTodoCount > 0);
                $('#menu').toggle(data.totalTodoCount > 0).html(this.menuTemplate({
                    completedTodoCount: data.completedTodoCount,
                    activeTodoCount: data.activeTodoCount,
                    filter: filter
                }));
            });
        },
        todoAdd: function (e) {

            const $input = $(e.target);
            const val = $input.val().trim();

            if (e.which === ENTER_KEY && val) {
                this.restCreate({ content: val }, () => {
                    this.todoFilter(this.filter);
                    $input.val('');
                });
            }
        },
        todoToggle: function (e) {

            const $input = $(e.target);
            const val = $input.prop('checked');
            const id = $input.closest('li').data('id');

            this.restUpdate({ id: id, done: val }, () => {
                this.todoFilter(this.filter);
            });
        },
        todoToggleAll: function (e) {

            const isChecked = $(e.target).prop('checked');

            this.restUpdate({ id: 'all', done: isChecked }, () => {
                this.todoFilter(this.filter);
            });
        },
        todoDelete: function (e) {

            const id = $(e.target).closest('li').data('id');

            this.restRemove(id, () => {
                this.todoFilter(this.filter);
            });
        },
        todoDeleteCompleted: function () {

            this.restRemove('completed', () => {
                if (this.filter === 'all') {
                    this.todoFilter(this.filter);
                }
                else {
                    window.location.href = '#/all';
                }
            });
        },
        todoEditStart: function (e) {

            const $input = $(e.target).closest('li').addClass('editing').find('.edit');

            $input.val($input.val()).focus();
            this.previousValue = $input.val();
        },
        todoEditGoing: function (e) {

            const input = e.target;

            if (e.which === ENTER_KEY) {
                input.blur();
            }

            if (e.which === ESCAPE_KEY) {
                $(input).data('abort', true).blur();
            }
        },
        todoEditStop: function (e) {

            const $input = $(e.target);
            const val = $input.val().trim();
            const id = $input.closest('li').data('id');

            if ($input.data('abort')) {
                this.todoFilter(this.filter);
            }
            else if (val) {
                if (val !== this.previousValue) {
                    this.restUpdate({ id: id, content: val }, () => {
                        this.todoFilter(this.filter);
                    });
                }
                else {
                    this.todoFilter(this.filter);
                }
            }
            else if (!val) {
                this.todoDelete(e);
            }
        },
        restBrowse: function (filter, next) {

            $.getJSON(REST_API + '/list/' + filter).always(next);
        },
        restCreate: function (todo, next) {

            $.post(REST_API, todo).always(next);
        },
        restRemove: function (id, next) {

            $.ajax(REST_API + '/' + id, { method: 'delete' }).always(next);
        },
        restUpdate: function (todo, next) {

            $.ajax(REST_API, { data: todo, method: 'put' }).always(next);
        }
    };

    App.init();
});
