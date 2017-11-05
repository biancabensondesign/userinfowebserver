var express = require('express');
var app = express();
var fs = require('fs')

var bodyParser = require('body-parser');



app.set('views', './views');
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: true})); //global function, parse data from form from client side

// GET homepage
app.get('/', function(request, response) { //necessary to load page
	response.render('index');
});

//GET all users
app.get('/users', function(request, response){

    fs.readFile('./user.json', function (error, data) { // callback with (parameters)
        if (error) {
            throw error;
        }

        var parsedData = JSON.parse(data);
        console.log("This is the app.get(/users) request");
        response.render('users', {users: parsedData}) //rendering the page and sending along package of data we retrieved from server, can send along as much data as you want as an object
        //json data is now in a object property key that is contained inside of an object called data
	})
})

//GET search users
app.get('/search', function(request,response){
	var input = request.query.q;
	fs.readFile('./user.json', function (error, data) { // callback with (parameters)
        if (error) {
            throw error;
        }

        var parsedData = JSON.parse(data);
		var output = parsedData.find(function(element) {
		return element.firstname === input || element.lastname === input; //input = request.query.q
		});
		response.render('search', {matchedUsers: output}) //
	});

	// var output = parsedData.find(element => element.firstname === input || element.lastname === input);
	
})

//GET NEW USERS
app.get('/new', function(request, response) {
    response.render('new');
});

//POST REQUEST new users
app.post('/new', function(request, response){ //what should happen to the data?
// console.log(request.body)
    var banana = request.body.firstname; //request.body = middleware being able to access data generated in post request
    var apple = request.body.lastname;
    var email = request.body.email; //collect data inside .get or .post?

    fs.readFile('./user.json', function (error, data) { // callback with (parameters)
        if (error) {
            throw error;
        }

        var parsedData = JSON.parse(data); //after parsing get array of object on server
        // console.log(parsedData);
        var threeInputForm = {
            firstname: banana,
            lastname: apple,
            email: email
        }

        parsedData.push(threeInputForm); //push the new user to the json file
            // console.log(parsedData)  
            // console.log(threeInputForm)
            // response.send('/users', parsedData)

        var stringifyData = JSON.stringify(parsedData); //after parsing get array of object on server
            // console.log(stringifyData);
        // var newUsers = stringifyData;
        fs.writeFile('./user.json', stringifyData, function (error) {
            if (error) {
                throw error;
            }
        });

        console.log(stringifyData)
    })

    response.redirect('/users') //add url, so a route!
}) //end of post request callback function


// - route 5: takes in the post request from the 'create user' form, 
// then adds the user to the users.json file. 
// Once that is complete, redirects to the route that displays all your users (from part 0).

// overwrite existing old list of users, replace with new list
//stringify
//writeFile
//console.log
// redirect to /users




app.listen(3000, function() {
    console.log('User information app listening on port 3000!')
})