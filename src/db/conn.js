const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/Nodedata", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
  })
  .then(() => {
    console.log("Connections is successful");
  })
  .catch((err) => {
    console.log("No connections");
  });
