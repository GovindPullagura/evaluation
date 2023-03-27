const express = require("express");
const cors = require("cors");
const { connection } = require("./db");
const { userRouter } = require("./routes/user.routes");
const { auth } = require("./middlewares/auth.middleware");
const { postsRouter } = require("./routes/posts.routes");
const app = express();
require("dotenv").config();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use("/users", userRouter);
app.use(auth);
app.use("/posts", postsRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to mongoDB");
  } catch (error) {
    console.log("Not connected to mongoDB");
  }
  console.log("Listening to the PORT");
});
