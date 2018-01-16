const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const posts = require('./app/controllers/jibble.controller.js');
const throttle = require("express-throttle");
//caching with redis and apicache
// const redis = require('redis');
// const apicache = require('apicache');
// // create a new redis client and connect to our local redis instance
// let cacheWithRedis = apicache
//                       .options({ redisClient: redis.createClient() })
//                       .middleware
//implement simple request throttling
var throttleOptions = {
    "burst": 10,
    "rate": "5/s"
  };

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const router = express.Router();

//auth all requests, if valid token continue
router.use(function (req, res, next) {
    if (!req.headers.authorization || req.headers.authorization != "Bearer af24353tdsfw") {
        //return res.status(501).json({ error: 'No credentials sent!' });
    }

    next();
});


// Create a new post
router.post('/posts', throttle(throttleOptions), posts.create);

// Retrieve all posts
//cacheWithRedis will cache the response, very simple package 
router.get('/posts', /*cacheWithRedis('5 minutes'),*/ throttle(throttleOptions), posts.findAllPosts);

// Retrieve a single post with postId
router.get('/posts/:postId', throttle(throttleOptions), posts.findOne);

// Update a post with postId
router.put('/posts/:postId', throttle(throttleOptions), posts.update);

// Delete a post with postId
router.delete('/posts/:postId', throttle(throttleOptions), posts.delete);

// Get collection of 30 items
router.get('/collection', throttle(throttleOptions), posts.getAll);

app.use('/api', router);
app.listen(3000)