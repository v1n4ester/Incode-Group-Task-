const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const authRoutes = require('./routes/auth')
const listRoutes = require('./routes/list') 

const PORT = 4000;
const app = express();
app.use(cors())

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use('/', authRoutes)
app.use('/list', listRoutes)

app.listen(PORT, async (err) => {
  if (err) {
    throw new Error(err);
  }
  mongoose.set('strictQuery', false)
  await mongoose
    .connect(
      "mongodb+srv://vlad:qwertyqwerty@authentification.w1qew2y.mongodb.net/auth?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("DB ok");
    })
    .catch((e) => console.log("DB error", e));
  console.log("Server is running");
});
