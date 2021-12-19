const axios = require('axios');
const express = require('express');
const router = express.Router();
const data = require('../data/locations');

router.get('/all', async (req, res) => {
  try {
    let all = await data.getAll();
    return res.json(all);
  } catch (e) {
    return res.status.json({ error: e });
  }
});

router.post('/add', async (req, res) => {
  try {
    let all = await data.create(req.body);
    return res.json(all);
  } catch (e) {
    console.log(e);
    return res.status(
      e instanceof TypeError ? 400 : 
      e instanceof Error ? 404 : 500)
      .json({ error: e });
  }
});

router.get('/addPost', async (req, res) => {
  try {
    let all = await data.addPost(req.body.locationId, req.body.postId);
    return res.json(all);
  } catch (e) {
    return res.status.json({ error: e });
  }
});

router.get('/byId/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    let all = await data.getLocById(req.params.id);
    return res.json(all);
  } catch (e) {
    return res.status.json({ error: e });
  }
});

router.patch('/update/:id', async (req, res) => {
  try {
    let all = await data.update(req.params.id, req.body);
    return res.json(all);
  } catch (e) {
    return res.status.json({ error: e });
  }
});

router.post('/remove/:id', async (req, res) => {
  try {
    let all = data.remove(req.params.id);
    return res.json(all);
  } catch (e) {
    return res.status.json({ error: e });
  }
});

router.post('/search', async (req, res) => {
  try {
    let all = await data.locSearch(req.body);
    return res.json(all);
  } catch (e) {
    return res.status.json({ error: e });
  }
});

module.exports = router;