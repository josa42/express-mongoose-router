# Express Mongoo Router

A simple router that exposes mongoose models in a REST api.

**Work in progress...**


## Features

* No Configuration required
* CRUD operations
* Filter for all attributes (single and multiple values)



## Example

```javascript
var express = require('express');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var RestRouter = require('express-mongoose-router');

// Model
var ExampleSchema = new mongoose.Schema({
    name: String,
    number: Number
});
var ExampleModel = mongoose.model('Example', ExampleSchema);

// App
var app = express();
app.use('/api', RestRouter(ExampleModel));

app.listen(3000);
```

### Request:

One example entry
```
GET /example/1
{
    "id": 1,
    "name": "Name 1",
    "number": 1
}
```

All example entries
```
GET /examples
[{
    "id": 1,
    "name": "Name 1",
    "number": 1
},{
    "id": 2,
    "name": "Name 1",
    "number": 2
},{
    "id": 3,
    "name": "Name 1",
    "number": 4
}]
```

All example entries where number is 1
```
GET /examples?number=1
[{
    "id": 1,
    "name": "Name 1",
    "number": 1
}]
```

All example entries where number is 1 or 2
```
GET /examples?number[]=1&number[]=2
[{
    "id": 1,
    "name": "Name 1",
    "number": 1
},{
    "id": 2,
    "name": "Name 1",
    "number": 2
}]
```

### CRUD Routes:

* POST **/api/examples**
* GET **/api/examples**
* GET **/api/example/:id**
* PUT **/api/example/:id**
* DELETE **/api/example/:id**
