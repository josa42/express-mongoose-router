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
            res.json(toJSON(Model, record));
        });
    });

    // Read (list): GET /examples
    router.get('/' + resources, function(req, res) {
        var query = getQuery(req.query, Model);
        Model.find(query, function(err, records) {
            if (err) res.send(err);
            res.json(records.map(toJSON.bind(null, Model)));
        });
    });

    // Read: GET /example/:id
    router.get('/' + resource + '/:id', function(req, res) {
        Model.findById(req.params.id, function(err, record) {
            if (err) res.send(err);
            res.json(toJSON(Model, record));
        });
    });

    // Update: PUT /example/:id
    router.put('/' + resource + '/:id', function(req, res) {
        Model.findById(req.params.id, function(err, record) {
            if (err) res.send(err);
            applyBody(req.body, record, Model);
            res.json(toJSON(Model, record));
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

function attributes(Model) {

    var attrs = [];

    Model.schema.eachPath(function(path) {
        if (!path.match(/^_/)) {
            attrs.push(path);
        }
    });

    return attrs;
}

function applyBody(body, record, Model) {

    attributes(Model)
        .filter(function(attr) {
            return body[attr] !== undefined;
        })
        .forEach(function(attr) {
            record[attr] = body[attr];
        });
}

function getQuery(params, Model) {

    var query = {};
    attributes(Model).forEach(function(attr) {
        setQueryParam(query, attr, params[attr]);
    });

    setQueryParam(query, '_id', params.id);

    return query;
}

function setQueryParam(query, key, value) {

    if (value !== undefined) {
        query[key] = (value instanceof Array) ? { $in: value } : value;
    }
}

function toJSON(Model, record) {
    var data = record.toJSON(),
        json = {};

    json.id = data._id;

    attributes(Model).forEach(function(path) {
        json[path] = data[path] || null;
    });

    return json;
}

module.exports = RestRouter;
