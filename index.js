const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const Person = require("./models/person");

const app = express();

app.use(express.static("build"));
app.use(cors());
app.use(express.json());

// Morgan defining custom token and then calling the token in the app.use
morgan.token("data", function (request) {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  }
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

// list all contacts
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// create new contact
app.post("/api/persons", (request, response) => {
  //extract body from the request
  const body = request.body;

  if (body.name === undefined) {
    return response.status(404).json({
      error: "name is missing",
    });
  }
  if (body.number === undefined) {
    return response.status(404).json({
      error: "number is missing",
    });
  }

  // Person.find({ name: body.name }).then((result) => {
  //   if (result) {
  //     return response.status(404).json({
  //       error: "name must be unique",
  //     });
  //   }
  //   const person = new Person({
  //     name: body.name,
  //     number: body.number,
  //   });

  //   person.save().then((savedPerson) => {
  //     response.json(savedPerson);
  //   });
  // });

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error));
});

// to change
app.get("/info", (request, response) => {
  const info = `
  <div>Phonebook contains ${persons.length} entries.</div>
  <br/>
  <div>${new Date()}</div>
  `;
  response.send(info);
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({
      error: "malformated id",
    });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
