//Connect stuff and things
const express = require('express');
const app = express();
const bodyParser= require('body-parser')
const path = require('path');
const MongoClient = require('mongodb').MongoClient


//MongoDB code
var connectionString ="mongodb+srv://<user>:<password>@cluster0.5fep3.mongodb.net/<dbname>?retryWrites=true&w=majority";
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    //Create Foodible Database
    const db = client.db("foodible")
    //Create Pantry collection

    //--------------------EXPRESS REQUEST HANDLERS------------------------//
    
    //Set view engine to ejs
    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true }))//Middleware
    
    //Route from navbar to home page (no action)
    app.get('/', (req, res) => {
        res.render('home.ejs', {})
    });
    
    //Route from navbar to allpantries (when it goes to all pantries, everything is displayed)
    app.get('/pantrylist', (req, res) => {
      db.collection('pantries').find().toArray()
        .then(results => {
          res.render('allpantries.ejs', {pantries: results});
        })
        .catch(error => console.error(error))   
    });

    //Route from navbar/homepage button to pantryform (no action)
    app.get('/addpantry', (req, res) => {
        res.render('pantryform.ejs', {})   
    });
    
    //Route from submit button to all pantries; redirects to all pantries and displays all of them, incl new pantry
    app.post('/submitpantry', (req, res) => {
      db.collection('pantries').insertOne(req.body)
      .then(result => {
        res.redirect('/pantrylist');
      })
      .catch(error => console.error(error))
    }); 
    
    //Route from navbar to allrestaurants (when it goes to all restaurants, everything is displayed)
    app.get('/restaurantlist', (req, res) => {
      db.collection('restaurants').find().toArray()
        .then(results => {
          res.render('allrestaurants.ejs', {restaurants: results});
        })
        .catch(error => console.error(error))   
    });

    //Route from navbar/homepage button to restaurantform (no action)
    app.get('/addrestaurant', (req, res) => {
      res.render('restaurantform.ejs', {})   
    });

    //Route from submit button to all restaurants; redirects to all restaurants and displays all of them, incl new restaurant
    app.post('/submitrestaurant', (req, res) => {
      db.collection('restaurants').insertOne(req.body)
      .then(result => {
        res.redirect('/restaurantlist');
      })
      .catch(error => console.error(error))
    });

    //Route from navbar/homepage button to volunteerform
    app.get('/volunteer', (req, res) => {
      res.render('volunteerform.ejs', {})   
    });

    //Route from submit button to home
    app.post('/registervolunteer', (req, res) => {
      console.log(req.body);
      var volunteer = req.body;
      //Insert email function, etc.
        res.render('confirmationform.ejs', {volunteer});
    });

    //Route to get restaurants of a certain city (VOLUNTEER VERSION)
    app.post('/volunteerrestaurants', (req, res) => {
      var volunteer = req.body;
      console.log(volunteer);
      db.collection('restaurants').find({city: volunteer.volunteercity}).toArray()
        .then(results => {
          var restaurants = results;
          db.collection('pantries').find({city: volunteer.volunteercity}).toArray()
          .then(results => {
            res.render('volunteerform.ejs', {volunteer, restaurants, pantries: results});
          })
        })
        .catch(error => console.error(error))   
    });

    //Route to get restaurants of a certain city (ALL RESTAURANTS VERSION)
    app.get('/searchrestaurants', (req, res) => {
      db.collection('restaurants').find({city: req.query.searchbar}).toArray()
        .then(results => {
          res.render('allrestaurants.ejs', {restaurants: results});
        })
        .catch(error => console.error(error))   
    });

    //Route to get pantries of a certain city (ALL PANTRIES VERSION)
    app.get('/searchpantries', (req, res) => {
      db.collection('pantries').find({city: req.query.searchbar}).toArray()
        .then(results => {
          res.render('allpantries.ejs', {pantries: results});
        })
        .catch(error => console.error(error))   
    });

    function getRestaurants(city) {

    }

    function getPantries(city) {

    }

    //Create server for browsers to connect to
    app.listen(3000, function() {
    console.log('listening on 3000')
  })

  })
  .catch(error => console.error(error))