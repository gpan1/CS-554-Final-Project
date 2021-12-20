const express = require("express");
const router = express.Router();
const data = require("../data/posts");
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

router.get("/byId/:id", async (req, res) => {
  try {
    let all = await data.postById(req.params.id);
    return res.json(all);
  } catch (e) {
    return res
      .status(e instanceof TypeError ? 400 : e instanceof Error ? 404 : 500)
      .json({ error: e });
  }
});

router.get("/popular", async (req, res) => {
  try {
    let all = await data.getPopularPosts();
    return res.json(all);
  } catch (e) {
    return res
      .status(e instanceof TypeError ? 400 : e instanceof Error ? 404 : 500)
      .json({ error: e });
  }
});

router.post("/add", async (req, res) => {
  try {
    let x = 
    {
        ...req.body,
      posterName: xss(req.body.posterName),
      title: xss(req.body.title),
      locationId: xss(req.body.locationId)
    }
    let y = (req.body.date);
    const date = y;
    const parsedDate = new Date(date);
    x.date = parsedDate;
    let all = await data.create(x);
    return res.json(all);
  } catch (e) {
    return res
      .status(e instanceof TypeError ? 400 : e instanceof Error ? 404 : 500)
      .json({ error: e });
  }
});

router.post("/addComment", async (req, res) => {
  try {
    console.log(req.body);
    console.log("hello");
    let x = 
    {
      posterName: xss(req.body.posterName),
      content: xss(req.body.content),
      postId: xss(req.body.postId)
    }
    console.log(x);
    let y = (req.body.date);
    const date = y;
    const parsedDate = new Date(date);
    x.date = parsedDate;
    let all = await data.addComment(x);
    return res.json(all);
  } catch (e) {
    return res
      .status(e instanceof TypeError ? 400 : e instanceof Error ? 404 : 500)
      .json({ error: e });
  }
});

// TODO: figure out how to correctly pass array data here
// router.post('/getPostsByTags', async(req, res) => {
//     try{
//         let all = await data.addComment(req.body);
//         return res.json(all);
//     } catch(e) {
//         return res.status.json({ error: e});
//     }
// });

router.patch("/update/:id", async (req, res) => {
  try {
    let x = {};
    if(req.body.posterName){
      x.posterName = xss(req.body.posterName);
    }
    if(req.body.title){
      x.title = xss(req.body.title);
    }
    if(req.body.posterName){
      x.content = xss(req.body.content);
    }
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
    let x = (req.body);
    let all = await data.postSearch(x);
    return res.json(all);
  } catch (e) {
    return res
      .status(e instanceof TypeError ? 400 : e instanceof Error ? 404 : 500)
      .json({ error: e });
  }
});

module.exports = router;
