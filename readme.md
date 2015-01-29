# Express Mongoo Router

A simple router that exposes mongoose models in a REST api.

**Work in progress...**

## Example

```
var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var RestRouter = require('express-mongoose-router');

// Model
var ExampleSchema = new mongoose.Schema({
    name: String
});
var ExampleModel = mongoose.model('Example', ExampleSchema);

// App
var app = express();
app.use('/api', RestRouter(ExampleModel));

```

### CRUD Routes:

* POST **/api/examples**
* GET **/api/examples**
* GET **/api/example/:id**
* PUT **/api/example/:id**
* DELETE **/api/example/:id**
