// const { request } = require("express");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

app.use(express.static("build"));
app.use(cors());
app.use(express.json());

// Morgan using predefined configuration
// app.use(morgan("tiny"));

// Morgan using custom function
// const format = morgan(function (tokens, req, res) {
//   return [
//     tokens.method(req, res),
//     tokens.url(req, res),
//     tokens.status(req, res),
//     tokens.res(req, res, "content-length"),
//     "-",
//     tokens["response-time"](req, res),
//     "ms",
//   ].join(" ");
// });
// app.use(format);

// Morgan defining custom token and then calling the token in the app.use
morgan.token("data", function (request) {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  }
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Gaga Poppendieck",
    number: "6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.post("/api/persons", (request, response) => {
  //generate random id
  const id = Math.floor(Math.random() * 1000000);

  //extract body from the request
  const body = request.body;

  if (!body.name) {
    return response.status(404).json({
      error: "name is missing",
    });
  }
  if (!body.number) {
    return response.status(404).json({
      error: "number is missing",
    });
  }

  if (persons.find((person) => person.name === body.name)) {
    return response.status(404).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: id,
    name: body.name,
    number: body.number,
  };

  //concat to create new array
  persons = persons.concat(person);

  response.json(person);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

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
