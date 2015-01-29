var router = require('express').Router();
var changeCase = require('change-case');
var plural = require('plural');

var defaultOptions = {};

function RestRouter(Model, options) {

    var name = changeCase.snake(Model.modelName),
        resource = plural(name, 1),
        resources = plural(resource);

    // Create: POST /examples
    router.post('/' + resources, function(req, res) {
        var record = new Model();

        applyBody(req.body, record, Model);

        // save the record and check for errors
        record.save(function(err) {
            if (err) res.send(err);
            res.json(toJSON(record));
        });
    });

    // Read (list): GET /examples
    router.get('/' + resources, function(req, res) {
        var query = getQuery(req.query, Model);
        Model.find(query, function(err, records) {
            if (err) res.send(err);
            res.json(records.map(toJSON));
        });
    });

    // Read: GET /example/:id
    router.get('/' + resource + '/:id', function(req, res) {
        Model.findById(req.params.id, function(err, record) {
            if (err) res.send(err);
            res.json(toJSON(record));
        });
    });

    // Update: PUT /example/:id
    router.put('/' + resource + '/:id', function(req, res) {
        Model.findById(req.params.id, function(err, record) {
            if (err) res.send(err);
            applyBody(req.body, record, Model);
            res.json(toJSON(record));
        });
    });

    // Delete: DELETE /example/:id
    router.delete('/' + resource + '/:id', function(req, res) {
        Model.remove({
            _id: req.params.id
        }, function(err) {
            if (err) res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });

    return router;
}

function getDB() {
    return options.db;
}

function setup(options) {
    defaultOptions.db = options.db;
}

function applyBody(body, record, Model) {

    Model.schema.eachPath(function(path) {
        if (body[path] !== undefined) {
            record[path] = body[path];
        }
    });

}

function getQuery(params, Model) {
    var query = {};
    Model.schema.eachPath(function(path) {
        // setQueryParam(query, path, params[path]);
    });

    setQueryParam(query, '_id', params.id);

    return query;
}

function setQueryParam(query, key, value) {

    if (value !== undefined) {
        if (value instanceof Array) {
            query[key] = { $in: value };
        } else {
            query[key] = value;
        }
    }
}

function toJSON(record) {
    var json = record.toJSON();

    json.id = json._id;
    delete json._id;
    delete json.__v;

    return json;
}

module.exports = RestRouter;
module.exports.setup = setup;
