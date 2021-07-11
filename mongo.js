const mongoose = require("mongoose");

// GETTING DATA from the command line
//node mongo.js yourpassword Anna 040-1234556
//node mongo.js yourpassword "Arto Vihavainen" 045-1232456
const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>.",
    "Save new entry to the database with: node mongo.js <password> <name> <number>"
  );
  process.exit(1);
}

const databaseConnect = () => {
  // url to connect
  const url = `mongodb+srv://fullstack:${password}@cluster0.qa3o1.mongodb.net/command-line?retryWrites=true&w=majority`;

  // connecting to the database via ODM
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  // structure of the data, data formats to use
  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  return mongoose.model("Person", personSchema);
};

// save new entry
//result: added Anna number 040-1234556 to phonebook
if (process.argv.length === 5) {
  const Person = databaseConnect();
  // GENERATING A NEW PERSON
  // creating a new item in a document
  const person = new Person({
    name: name,
    number: number,
  });

  // save the new item into the database
  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}

// print the whole phonebook
//only password: node mongo.js yourpassword
//displays the whole phonebook
// phonebook:
// Anna 040-1234556
// Arto Vihavainen 045-1232456
// Ada Lovelace 040-1231236
if (process.argv.length === 3) {
  const Person = databaseConnect();
  Person.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
