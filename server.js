const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
mongoose
  .connect(process.env.MONGO_URI)
  .then(console.log(`Database connected Successfully!`))
  .catch((e) => console.error(e));

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App is up again : ${process.env.PORT}`);
});
