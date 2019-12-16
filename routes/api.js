/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
var db;

MongoClient.connect(process.env.DB, (err, data) => {
    if(err) console.log('Database error: ' + err);
    db=data
    console.log("Database connected")
});  


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res, next){

        db.collection("books").aggregate(
            [ {'$project': {
               'title': 1,
               'commentcount' : { $size: "$comments" }
             }}
             ]).toArray((err, data) =>{
          if (err) {
            return next(err)
          } else {
            return res.json(data)
          }
        })
    })
    
    .post(function (req, res, next){
          let title = req.body.title;
          if(!title) {
            return next(new Error("missing title"));
          }
          let book = {
            "title"   : title,
            "comments" : [],
            "created_on": new Date(),
            "updated_on": new Date()
          }

          db.collection('books').insertOne(book, (err, data) => {
            if(err) {
              return next(err);
            } else 
              book._id=data.insertedId;
              return res.json(book);
          });
    })
    
    .delete(function(req, res, next){
          db.collection('books').deleteMany({}, (err, data) => {
            if(err) {
              return next(err);
            } else 
              return res.send('complete delete successful');
          });
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res, next ){
      var bookid = req.params.id;
      db.collection("books").findOne({'_id' : ObjectId(bookid)},(err, data) =>{
          if (err) {
            return next(err)
          } else {
            return res.json(data)
          }
        })
    })
    
    .post(function(req, res, next){
      var bookid = req.params.id;
      var comment = req.body.comment;
      db.collection('books').findOneAndUpdate(
        {'_id': ObjectId(bookid)},
        {'$set' : {'updated_on' : new Date()},
         '$push' : {'comments' : comment}}, 
        { 'returnOriginal': false},
        (err, data) => {
          if(err) {
            return next(err);
          } else 
            return res.json(data.value);
        });
})
    
    .delete(function(req, res, next){
      var bookid = req.params.id;
      db.collection("books").deleteOne({'_id' : ObjectId(bookid)},(err, data) =>{
          if (err) {
            return next(err)
          } else {
            return res.send('delete successful');
          }
        })
      //if successful response will be 'delete successful'
    });
  
};
