require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connect = require("./db");
const { verify } = require("./utils/mailer");

const userRouter = require("./routes/user");
const quizRouter = require("./routes/quiz");

const { auth } = require("./utils/middlewares");

const port = process.env.PORT || 8000;
const app = express();
connect();
verify();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(morgan("dev"));

app.use("/user", userRouter);
app.use("/quiz", quizRouter);

app.get("/", auth, (req, res) => {
  res.status(200).json({ message: "you are authenticated" });
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
