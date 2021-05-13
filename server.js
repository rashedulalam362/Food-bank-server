
const express = require('express')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const cors=require('cors');
const bodyParser=require('body-parser')
require('dotenv').config();

const port =process.env.PORT || 8080;
console.log(process.env.DB_USER);
app.use(cors());

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello Working !!!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hiyqx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
console.log('err',err);
const productsCollection = client.db("FoodBasket").collection("products");
const ordersCollection = client.db("FoodBasket").collection("orders");
   console.log('db conneted ');
  
      // Get Products from database
      app.get('/products', (req, res) => {
        productsCollection.find()
        .toArray((err, items) => {
            res.send(items);
        })
    });

    // Save Product on database
    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        console.log('adding new event: ', newProduct)
        productsCollection.insertOne(newProduct)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    // Find Product using id and Delete Product from Database
    app.delete('/deleteProduct/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        productsCollection.deleteOne({_id: id})
        .then(result => {
            res.send(result.deletedCount > 0)
        })
    });

    // Get Product from Database using ID
    app.get('/products/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        productsCollection.find({_id: id})
        .toArray((err, product) => {
            res.send(product);
        })
    });

     // Confirm Order and Save Order Details To Database
     app.post('/confirmOrder', (req, res) => {
        const newOrder = req.body;
        ordersCollection.insertOne(newOrder)
          .then(result => {
            res.send(result.insertedCount > 0);
          })
      });

      // Load Products Base On User Email Address
      app.get('/orders', (req, res) => {
          console.log(req.query.useremail)
        const queryEmail = req.query.useremail;
        ordersCollection.find({ useremail: queryEmail })
              .toArray((err, product) => {
                res.send(product);
              })
      })




});



app.listen(process.env.PORT||port)
  
