const express = require("express");
const { PostModel } = require("../models/post.model");
const postsRouter = express.Router();
const jwt = require("jsonwebtoken");

postsRouter.post("/add", async (req, res) => {
  const payload = req.body;
  try {
    const newPost = new PostModel(payload);
    await newPost.save();
    res.send({ msg: "New Post has been added" });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

postsRouter.get("/", async (req, res) => {
  const token = req.headers.authorization;
  const queries = req.query;
  const decoded = jwt.verify(token, "eval");
  try {
    const posts = await PostModel.find({
      userID: decoded.userID,
      // $and: [
      //   { no_of_comments: { $gt: +queries.min } },
      //   { no_of_comments: { $lt: +queries.max } },
      // ],
    });
    res.send(posts);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

postsRouter.get("/top", async (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "eval");
  try {
    const posts = await PostModel.find({ userID: decoded.userID });
    let max = -Infinity;
    let post;
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].no_of_comments > max) {
        max = posts[i].no_of_comments;
        post = posts[i];
      }
    }
    res.send(post);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

postsRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await PostModel.findByIdAndDelete({ _id: id });
    res.send({ msg: "Post deleted successfully" });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

postsRouter.patch("/update/:id", async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  try {
    await PostModel.findByIdAndUpdate({ _id: id }, payload);
    res.send({ msg: "Post updated successfully" });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = { postsRouter };
