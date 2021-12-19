const express = require('express');
const router = express.Router();
const data = require('../data/posts');

router.get('/all', async(req, res) => {
    try{
        let all = await data.getAll();
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

router.get('/byId/:id', async(req, res) => {
    try{
        let all = await data.postById(req.params.id);
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

router.get('/popular', async(req, res) => {
    try{
        let all = await data.getPopularPosts();
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

router.post('/add', async(req, res) => {
    try{
        let all = await data.create(req.body);
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

router.post('/addComment', async(req, res) => {
    try{
        let all = await data.addComment(req.body);
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
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

router.patch('/update/:id', async(req, res) => {
    try{
        let all = await data.update(req.params.id, req.body);
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

router.post('/remove/:id', async(req, res) => {
    try{
        let all = data.remove(req.params.id);
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

router.get('/search', async(req, res) => {
    try{
        let all = data.postSearch(req.body);
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

module.exports = router;