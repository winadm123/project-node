require('dotenv').config()
const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcrypt");

require("./db/conn");
const User = require("./models/usermsg");
const port = process.env.PORT || 3000;

// setting the path;
const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");

app.use(
  "/css",
  express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js"))
);
app.use(
  "/jq",
  express.static(path.join(__dirname, "../node_modules/jquery/dist"))
);

app.use(express.static(staticPath));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialPath);


// console.log(process.env.SECRET_KEY)

//routing
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/contact", async (req, res) => {
  try {
    // res.send(req.body)
    // const userData =new User(req.body)
    // userData.save();
    const password = req.body.password;
    const cnfpassword = req.body.cnfpassword;

    if (password === cnfpassword) {
      const userData = await new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        cnfpassword: req.body.cnfpassword,
        phone: req.body.phone,
        message: req.body.message,
      });
      console.log("ths success part" + userData);

      const token = await userData.generateAuthToken();
      console.log("the token part" + token);

      const users = await userData.save();
      res.status(201).render("index");
      console.log("the token page" + users);
    } else {
      res.send("password not match");
    }
  } catch (error) {
    res.status(400).send(error);
    console.log("The error page show");
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userEmail = await User.findOne({ email: email });

    const isMatch = await bcrypt.compare(password, userEmail.password);

    const token = await userEmail.generateAuthToken();
    console.log("the token part " + token);

    if (isMatch) {
      res.status(201).render("index");
    } else {
      res.send("Invalid Password details");
    }
  } catch (error) {
    res.status(400).send("Invalid details");
  }
});

// password bcrypt
// const securePassword = async (password)=>{

// const passwordHash = await bcrypt.hash(password, 10)
// console.log(passwordHash);

// const passwordmatch = await bcrypt.compare("thapa", passwordHash)
// console.log(passwordmatch);

// }

// securePassword("thapa")

//JWT
// const jwt = require('jsonwebtoken')

// const createToken = async () =>{
// const token = await jwt.sign({_id: "6029f90bb242d24d6c826b4a"}, "mynameisvickyjainnodejsdeveloper",{
//   expiresIn: "2 seconds"
// });

// console.log(`my token is ${token}`);
// //user verified

// const userVer = await jwt.verify(token, "mynameisvickyjainnodejsdeveloper")
// console.log(userVer)
// }

// createToken();

app.listen(port, () => {
  console.log(`Port running on ${port}`);
});
