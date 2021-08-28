const express = require("express");
const morgan = require("morgan");
const multer = require("multer");
const models = require("./models");
const path = require("path");

/* PORT assign */
const PORT = process.env.PORT || 8080;
const message = `Server is running on PORT:${PORT}.`;
const expressValidator = require("express-validator");

/* Init express */
const app = express();

/* API monitoring */
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));

/* express-validator */
app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      let namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;
      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return msg;
    },
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "property_Image");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({ storage: storage });

/* Application router */
app.use("/api/v1", upload.array("image", 4), require("./routes"));

/* Testing router */
app.get("/test", (req, res) => res.send(message));

/* Restiction router */
app.all("*", (req, res) => res.status(404).send(`Access denied`));

// Connection with db.
models.sequelize
  .sync({ force: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(message, "\nConnection has been established successfully.")
    )
  )
  .catch((err) => console.error("Unable to connect to the database:", err));
