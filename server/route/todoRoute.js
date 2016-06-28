'use strict';

const object = '/todo';
const restapi = '/api/v1' + object;
const config = { plugins: { errorh: false } };
const isWeb = { web: true };


module.exports = [
    {
        path: object,
        method: 'get',
        handler: { todoCreate: isWeb }
    },
    {
        path: object + '/list',
        method: 'get',
        handler: { todoBrowse: isWeb }
    },
    {
        path: object + '/{id}',
        method: 'get',
        handler: { todoObtain: isWeb }
    },
    {
        path: restapi + '/list',
        method: 'get',
        handler: { todoBrowse: {} },
        config: config
    },
    {
        path: restapi + '/{id}',
        method: 'get',
        handler: { todoObtain: {} },
        config: config
    },
    {
        path: restapi + '/{id}',
        method: 'delete',
        handler: { todoRemove: {} },
        config: config
    },
    {
        path: restapi + '/{any*}',
        method: 'post',
        handler: { todoCreate: {} },
        config: config
    },
    {
        path: restapi + '/{any*}',
        method: 'put',
        handler: { todoUpdate: {} },
        config: config
    }
];
