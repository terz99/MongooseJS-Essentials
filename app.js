var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Book = require("./Book.model");

mongoose.connect('mongodb://localhost/examples', {
    useMongoClient: true,
});

var port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", function(req, res) {
    res.send("happy to be here");
    res.end();
});

app.get("/books", function(req, res) {
    console.log("Getting all the books!");
    Book.find({})
    .exec(function(err, books) {
        if(err){
            res.send("error has occured");
        } else {
            console.log(books);
            res.json(books);
        }
    });
})

app.get("/books/:id", function(req, res) {
    Book.findOne({
        _id: req.params.id
    }).exec(function(err, book) {
        if(err){
            res.send("error occured");
        } else {
            console.log(book);
            res.json(book);
        }
    })
});

app.post("/book", function(req, res) {
    var newBook = new Book();

    newBook.title = req.body.title;
    newBook.author = req.body.author;
    newBook.category = req.body.category;

    newBook.save(function(err, book) {
        if(err){
            res.send("error saving book");
        } else {
            console.log(book);
            res.send(book);
        }
    });
});

app.post("/book2", function(req, res) {
    Book.create(req.body, function(err, book) {
        if(err){
            res.send("error saving book");
        } else {
            console.log(book);
            res.send(book);
        }
    });
});

app.put("/book/:id", function(req, res) {
    Book.findOneAndUpdate({
        _id: req.params.id
    }, { $set: { title: req.body.title }}, { upsert: true }, function(err, book) {
        if(err){
            res.send("error occured");
        } else {
            console.log(book);
            res.send(book);
        }
    } );
});

app.delete("/book/:id", function(req, res) {
    Book.findOneAndRemove({
        _id: req.params.id
    }, function(err, book) {
        if(err){
            res.send("error deleting book");
        } else {
            console.log(book);
            res.send(book);
        }
    });
});

app.listen(port, function(error, request) {
    if(error){
        console.log("Server crashed! Reason: " + error.toString());
    } else {
        console.log("Server running on port: " + port);
    }
});
