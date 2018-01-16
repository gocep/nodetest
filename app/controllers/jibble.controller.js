const request = require('request');
const fetch = require('node-fetch');

const postsUrl = 'https://jsonplaceholder.typicode.com/posts';
const albumsUrl = 'https://jsonplaceholder.typicode.com/albums';
const usersUrl = 'https://jsonplaceholder.typicode.com/users';
const headers = {
    'Accept': 'application/json',
    'Accept-Charset': 'utf-8',
    'User-Agent': 'my-jibble-test'
};

exports.create = function (req, res) {
    fetch(postsUrl, {
        method: 'POST',
        body: JSON.stringify({
            title: req.params.title,
            body: req.params.body,
            userId: req.params.userId
        }),
        headers: headers
    })
        .then(json)
        .then(function (data) {
            console.log(data);
        })
        .catch(function (error) {
            console.log('Fetch Error :-S', error);
        });
};

exports.findAllPosts = function (req, res) {
    fetch(postsUrl)
        .then(status)
        .then(json)
        .then(function (data) {
            res.send(data);
        })
        .catch(function (error) {
            res.send('Fetch Error :-S', error);
        });
};

exports.getAll = function (req, res) {

    let sumRecords = 30;
    let numposts = Math.floor(Math.random() * 15) + 1;
    let numalbums = Math.floor(Math.random() * 15) + 1;
    let numusers = 30 - (numposts + numalbums);
    let jsonPosts, jsonAlbums, jsonUsers;
    let finalJson;

    console.log(numalbums + " " + numposts + " " + numusers);

    jsonPosts = getPosts(numposts);
    //console.log(jsonPosts);

    jsonAlbums = getAlbums(numalbums);
    //console.log(jsonAlbums);
    jsonUsers = getUsers(numusers);

    Promise.all([jsonPosts, jsonAlbums, jsonUsers]).then(resp => {

        let posts = resp[0];
        let albums = resp[1];
        let users = resp[2];
        finalJson = { 
            post: posts, 
            album: albums, 
            user: users
        };
        res.send(JSON.stringify(finalJson));
    
        // use them here
    
    });    
};

exports.findOne = function (req, res) {
    // Find a single note with a noteId
    Note.findById(req.params.noteId, function (err, data) {
        if (err) {
            res.status(500).send({ message: "Could not retrieve note with id " + req.params.noteId });
        } else {
            res.send(data);
        }
    });
};
function getUsers(numusers) {
    return fetch(usersUrl + "?_limit=" + numusers)
        .then(status)
        .then(json)
        .then(function (data) {
            //console.log(data);
            return data;
        })
        .catch(function (error) {
            return error;
        });

    //return obj;
}
function getPosts(numposts) {
    return fetch(postsUrl + "?_limit=" + numposts)
        .then(status)
        .then(json)
        .then(function (data) {
            //console.log(data);
            return data;
        })
        .catch(function (error) {
            return error;
        });
}
function getAlbums(numalbums) {
    return fetch(albumsUrl + "?_limit=" + numalbums)
        .then(status)
        .then(json)
        .then(function (data) {
            //console.log(data);
            return data;
        })
        .catch(function (error) {
            return error;
        });
}
exports.update = function (req, res) {
    fetch(postsUrl + "/" + req.params.id, {
        method: 'PUT',
        body: JSON.stringify({
            id: req.params.id,
            title: req.params.title,
            body: req.params.body,
            userId: req.pa.userId
        }),
        headers: headers
    })
        .then(json)
        .then(function (data) {
            console.log(data);
        })
        .catch(function (error) {
            console.log('Fetch Error :-S', error);
        });

};

exports.delete = function (req, res) {
    fetch(postsUrl + '/' + req.params.noteId, {
        method: 'DELETE'
    });
};

function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

function json(response) {
    return response.json()
}