const axios = require('axios');
const express = require('express');
const router = express.Router();
const data = require('../data/locations');

router.get('/alllocations', async(req, res) => {
    try{
        let all = await data.getAll();
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

router.get('/addposts', async(req, res) => {
    try{
        let all = await data.addPost(req.body.locationId, req.body.postId);
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

router.get('/lCreate', async(req, res) => {
    try{
        let all = await data.create(req.body);
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

router.get('/locUpdate/:id', async(req, res) => {
    try{
        let all = await data.update(req.params.id, req.body);
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

router.get('/locRemove/:id', async(req, res) => {
    try{
        let all = data.remove(req.params.id);
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

router.get('/locSearch', async(req, res) => {
    try{
        let all = data.locSearch(req.body);
        return res.json(all);
    } catch(e) {
        return res.status.json({ error: e});
    }
});

module.exports = router;