'use strict';

const restapi = '/api/v1/todo';

const success = (res) => {

    bootbox.alert(res.success, () => {

        window.location.href = '/todo/list';
    });
};

const fail = (res) => {

    let message = 'An unexpected error occured.';

    if (res && res.responseJSON && res.responseJSON.message) {
        message = res.responseJSON.message;
    }

    bootbox.alert(message);
};

jQuery.fn.serializeObject = function () {
    const o = {};
    const a = this.serializeArray();
    jQuery.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        }
        else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

jQuery('form').on('submit', () => {

    return false;
});

jQuery('#todoItem').on('submit', function () {

    const todo = jQuery(this).serializeObject();

    if (todo.id) {
        delete todo.crumb;

        jQuery.ajax({
            method: 'put',
            url: restapi,
            data: todo
        }).done(success).fail(fail);
    }
    else {
        delete todo.id;

        jQuery.ajax({
            method: 'post',
            url: restapi,
            data: todo
        }).done(success).fail(fail);
    }
});

jQuery('.toggle-todo').on('click', function () {

    const obj = jQuery(this);
    let done = obj.data('done');

    if (done === 'on' || done === 'true' || done === true) {
        done = false;
    }
    else {
        done = true;
    }

    jQuery.ajax({
        method: 'put',
        url: restapi,
        data: {
            id: obj.data('id'),
            done: done
        }
    }).done(success).fail(fail);
});

jQuery('.delete-todo').on('click', function () {

    jQuery.ajax({
        method: 'delete',
        url: restapi + '/' + jQuery(this).data('id')
    }).done(success).fail(fail);
});
