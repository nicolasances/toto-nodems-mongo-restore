var Controller = require('toto-api-controller');

var postMongoRestoreDlg = require('./dlg/PostMongoRestoreDelegate');

var apiName = 'mongo-restore';

var api = new Controller(apiName);

api.path('POST', '/restores', (req, res) => {postMongoRestoreDlg})

api.listen();
