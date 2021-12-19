const axios = require('axios');
const express = require('express');
const router = express.Router();
const data = require('../data/posts');


router.get('/allPosts', async(req, res) => {
    try{
        let all = await data.getAll();
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

router.get('/postById/:id', async(req, res) => {
    try{
        let all = await data.postById(req.params.id);
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

router.get('/getPostById/:id', async(req, res) => {
    try{
        let all = await data.getPostById(req.params.id);
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

router.get('/getPopularPosts', async(req, res) => {
    try{
        let all = await data.getPopularPosts();
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

router.post('/pCreate', async(req, res) => {
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

router.get('/getPostByTags', async(req, res) => {
    try{
        let all = await data.addComment(req.body);
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

router.get('/getLocById/:id', async(req, res) => {
    try{
        let all = await data.getLocById(req.params.id);
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

router.patch('/postUpdate/:id', async(req, res) => {
    try{
        let all = await data.update(req.params.id, req.body);
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

router.post('/postRemove/:id', async(req, res) => {
    try{
        let all = data.remove(req.params.id);
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

router.get('/postSearch', async(req, res) => {
    try{
        let all = data.postSearch(req.body);
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

module.exports = router;