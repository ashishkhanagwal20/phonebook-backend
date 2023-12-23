require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const Phonebook = require("./models/phonebook");

const morgan = require("morgan");

app.use(cors());

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("dist"));
app.use(express.urlencoded({ extended: true }));
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);
let phonebook = [
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
];
app.get("/", (req, res) => res.send("<h1>Hello World!</h1>"));
app.get("/api/persons", (req, res) => {
  Phonebook.find({}).then((phonebook) => {
    res.json(phonebook);
  });
});

// app.get("/api/persons/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const persons = phonebook.find((person) => {
//     return person.id === id;
//   });
//   if (persons) {
//     res.json(persons);
//   } else {
//     res.status(404).end("404 Page not found");
//   }
// });

// app.get("/api/persons/:id", (request, response) => {
//   Phonebook.findById(request.params.id).then((phonebook) => {
//     response.json(phonebook);
//   });
// });

app.get("/api/persons/:id", (request, response, next) => {
  Phonebook.findById(request.params.id)
    .then((phonebook) => {
      if (phonebook) {
        response.json(phonebook);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

const generateId = () => {
  const maxId =
    phonebook.length > 0 ? Math.max(...phonebook.map((n) => n.id)) : 0;
  return maxId + 1;
};

// app.post("/api/persons", (req, res) => {
//   const body = req.body;

//   const person = {
//     name: body.name,
//     number: body.number,
//     id: generateId(),
//   };

//   if (!body.name) {
//     return res.status(400).json({
//       error: "Name is Missing",
//     });
//   }
//   if (!body.number) {
//     return res.status(400).json({
//       error: " Number is Missing",
//     });
//   }
//   const name = phonebook.find((person) => {
//     return person.name === body.name;
//   });
//   if (name) {
//     return res.status(409).json({
//       error: "Name aleady exists",
//     });
//   }

//   phonebook = phonebook.concat(person);

//   res.json(person);
// });

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name) {
    return response.status(400).json({
      error: "Name is Missing",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: " Number is Missing",
    });
  }
  const phonebook = new Phonebook({
    name: body.name,
    number: body.number,
  });
  phonebook.save().then((person) => {
    response.json(person);
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Phonebook.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPhonebook) => {
      response.json(updatedPhonebook);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Phonebook.findByIdAndDelete(request.params.id)
    .then((result) => {
      console.log(result); // Log the result to see what was deleted
      response.status(204).end();
    })
    .catch((error) => {
      console.error(error); // Log any errors
      next(error);
    });
});

app.get("/info", (req, res) => {
  const length = phonebook.length;
  const date = new Date();
  res.send(`Phonebook has info for ${length} People <br/>${date}`);
});
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
