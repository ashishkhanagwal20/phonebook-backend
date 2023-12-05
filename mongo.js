const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit();
}

const password = process.argv[2];
const phoneName = process.argv[3];
const phoneNumber = process.argv[4];

const url = `mongodb+srv://ashishkhanagwal:${password}@cluster0.myq2kw0.mongodb.net/phonebookapp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Phonebook = mongoose.model("Phonebook", phonebookSchema);

const phonebook = new Phonebook({
  name: phoneName,
  number: phoneNumber,
});

if (process.argv.length < 4) {
  Phonebook.find({}).then((result) => {
    console.log("Phonebook");
    result.forEach((phonebook) => {
      console.log(`${phonebook.name}  ${phonebook.number}`);
    });
    mongoose.connection.close();
  });
} else {
  phonebook.save().then((result) => {
    console.log("Phone number saved!");
    mongoose.connection.close();
  });
}
