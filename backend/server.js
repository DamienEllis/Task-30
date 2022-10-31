const express = require('express')
const fs = require('fs')
const app = express()
const port = process.env.PORT || 8080
const cors = require('cors')
app.use(cors())
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
const request = require('request');
const UserAgent = require('user-agents');
const userAgent = new UserAgent();
var rp = require('request-promise');
const helmet = require("helmet");


// get users by search
app.get('/user', (req, resp)=>{

    // set query options for searching via github
    const options = {
        url: 'https://api.GitHub.com/users/' + req.query.name,
        headers: {
            'Authorization': 'token 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',
            'User-Agent': userAgent.toString()
        }
    };

    // set options
    rp(options)
    .then(function (user) {
        // get the response
        resp.send(user);
    })
    .catch(function (err) {
        // log error
        console.log('Oops! This is awkward. ' + err);
    });
});

// gets the list of repositories
app.get('/repos', (req, resp)=>{

    // set query options for searching via github
    const options = {
        url: 'https://api.GitHub.com/users/' + req.query.name + '/repos?sort=created&direction=desc&per_page=5',
        headers: {
            'Authorization': 'token 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',
            'User-Agent': userAgent.toString()
        }
    };

    rp(options)
    .then(function (repo) {
        // get the response
        resp.send(repo);
    })
    .catch(function (err) {
        console.log('Oops! This is awkward. ' + err);
    });
})

// get the last 5 commits
app.get('/commits', (req, resp)=>{

    // query options for commit api
    const options = {
        url: 'https://api.GitHub.com/repos/'+req.query.name+'/'+req.query.repo+'/commits?per_page=5',
        headers: {
            'Authorization': 'token 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',
            'User-Agent': userAgent.toString()
        }
    };

    rp(options)
    .then(function (repo) {
        // get the response
        resp.send(repo);
    })
    .catch(function (err) {
        // log error
        console.log('Oops! This is awkward. ' + err);
    }); 
})

// users via github
app.get('/users', (req, resp)=>{

    // query options for users api
    const options = {
        url: 'https://api.GitHub.com/search/users?q=' + req.query.username,
        headers: {
            'Authorization': 'token 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',
            'User-Agent': userAgent.toString()
        }
    };

    rp(options)
    .then(function (users) {
        // convert response to json
        var jsonResp = JSON.parse(users);

        // send to client
        resp.send(jsonResp["items"]);
    })
    .catch(function (err) {
        // log error
        console.log('Oops! This is awkward. ' + err);
    }); 
})

// gets list of users
app.get('/labusers', (req, resp)=>{

    // query opions to get users via gitlab
    const options = {
        url: 'https://gitlab.com/api/v4/users?search=' + req.query.username,
        headers: {
            'Authorization': 'Bearer glpat-sHcGNszDb-bHCmxkyx6v',
            'User-Agent': userAgent.toString()
        }
    };

    rp(options)
    .then(function (users) {
        // parse response to json
        var jsonResponse = JSON.parse(users);
        resp.send(jsonResponse);
    })
    .catch(function (err) {
        // log error
        console.log('Oops! This is awkward. ' + err);
    }); 
})

// gets user via gitlab
app.get('/labuser', (req, resp)=>{

    const options = {
        url: 'https://gitlab.com/api/v4/users?username=' + req.query.username,
        headers: {
            'Authorization': 'Bearer glpat-sHcGNszDb-bHCmxkyx6v',
            'User-Agent': userAgent.toString()
        }
    };

    rp(options)
    .then(function (user) {
        // parse response to json
        var jsonResp = JSON.parse(user);

        // send response to client
        resp.send(jsonResp);
    })
    .catch(function (err) {
        // log error
        console.log('Oops! This is awkward. ' + err);
    }); 
})

// gets the list of repos for user
app.get('/labRepos', (req, resp)=>{

    // query options for gitlab repo endpoint
    const options = {
        url: 'https://gitlab.com/api/v4/users/'+req.query.userID+'/projects?pagination=keyset&per_page=5&order_by=id&sort=asc',
        headers: {
            'Authorization': 'Bearer glpat-sHcGNszDb-bHCmxkyx6v',
            'User-Agent': userAgent.toString()
        }
    };

    rp(options)
    .then(function (repos) {
        // parse response to json
        var jsonResponse = JSON.parse(repos);

        // send response to client
        resp.send(jsonResponse);
    })
    .catch(function (err) {
        // log error
        console.log('Oops! This is awkward. ' + err);
    }); 
})

// assign helment to app
app.use(helmet());

app.listen(port, () => console.log('Listening engaged: ' + port))