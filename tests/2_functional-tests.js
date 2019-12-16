/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var bookId;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({
          title: 'Title for test',
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.equal(res.body.title, 'Title for test');
          bookId=res.body._id;
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 500);
          done();
        });
      });
      
    });

      
    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200, "status not equals to 200");
          assert.isArray(res.body);
          assert.property(res.body[0], 'title');
          assert.property(res.body[0], 'commentcount');
          assert.property(res.body[0], '_id');
          done();
        });
      });      
      

   suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
      chai.request(server)
        .get('/api/books/5df61ecce0c6ef102f362aad')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200, "status not equals to 200");
          assert.isNull(res.body);
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
      chai.request(server)
        .get('/api/books/'+bookId)
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200, "status not equals to 200");
          assert.equal(res.body._id, bookId);
          assert.equal(res.body.title, 'Title for test');
          assert.equal(res.body.comments.length, 0);  
          done();
        });
      });
      
    });


  suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/'+bookId)
        .send({
          comment: 'comment for test',
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.equal(res.body.comments.length, 1);  
          assert.equal(res.body.comments[0], 'comment for test');  
          done();
        });
      });
      });

    });

    
    suite('DELETE /api/bookd/{id} => text', function() {
      
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/books/'+bookId)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, "delete successful");
          done();
        })
      });
    });

  });

});
