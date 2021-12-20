const axios = require("axios");
const express = require("express");
const router = express.Router();
const data = require("../data/locations");
const xss = require("xss");

router.get("/all", async (req, res) => {
  try {
    let all = await data.getAll();
    return res.json(all);
  } catch (e) {
    return res
      .status(e instanceof TypeError ? 400 : e instanceof Error ? 404 : 500)
      .json({ error: e });
  }
});

router.post("/add", async (req, res) => {
  try {
    let x = xss(req.body);
    let all = await data.create(x);
    return res.json(all);
  } catch (e) {
    console.log(e);
    return res
      .status(e instanceof TypeError ? 400 : e instanceof Error ? 404 : 500)
      .json({ error: e });
  }
});

router.get("/addPost", async (req, res) => {
  let x = xss(req.body.locationId);
  let y = xss(req.body.postId);
  try {
    let all = await data.addPost(x, y);
    return res.json(all);
  } catch (e) {
    return res
      .status(e instanceof TypeError ? 400 : e instanceof Error ? 404 : 500)
      .json({ error: e });
  }
});

router.get("/byId/:id", async (req, res) => {
  try {
    let all = await data.getLocById(req.params.id);
    return res.json(all);
  } catch (e) {
    return res
      .status(e instanceof TypeError ? 400 : e instanceof Error ? 404 : 500)
      .json({ error: e });
  }
});

router.get("/byTags", async (req, res) => {
  try {
    let x = xss(req.body);
    let all = await data.getLocsByTags(x);
    return res.json(all);
  } catch (e) {
    return res
      .status(e instanceof TypeError ? 400 : e instanceof Error ? 404 : 500)
      .json({ error: e });
  }
});

router.patch("/update/:id", async (req, res) => {
  try {
    let x = xss(req.body);
    let all = await data.update(req.params.id, x);
    return res.json(all);
  } catch (e) {
    return res
      .status(e instanceof TypeError ? 400 : e instanceof Error ? 404 : 500)
      .json({ error: e });
  }
});

router.post("/remove/:id", async (req, res) => {
  try {
    let all = data.remove(req.params.id);
    return res.json(all);
  } catch (e) {
    return res
      .status(e instanceof TypeError ? 400 : e instanceof Error ? 404 : 500)
      .json({ error: e });
  }
});

router.post("/search", async (req, res) => {
  try {
    let x = xss(req.body);
    let all = await data.locSearch(x);
    return res.json(all);
  } catch (e) {
    return res
      .status(e instanceof TypeError ? 400 : e instanceof Error ? 404 : 500)
      .json({ error: e });
  }
});

router.get('/popular', async (req, res) => {
  try {
    let all = await data.getPopularLocations();
    return res.json(all);
  } catch (e) {
    return res
      .status(e instanceof TypeError ? 400 
        : e instanceof Error ? 404
        : 500)
      .json({error: e});
  }
});

module.exports = router;
