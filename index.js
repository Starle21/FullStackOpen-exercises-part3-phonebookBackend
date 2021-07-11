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

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

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

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => response.json(person));
});

// to change
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
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

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
