const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require("mongodb");
const fileUpload = require("express-fileupload");
const fs = require('fs-extra');
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.cfh8khq.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`;
const client = new MongoClient(uri);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
  res.send('Hello World!')
})






async function run() {
  try {
    const database = client.db(`${process.env.DATABASE}`);
    const customerOrderCollection = database.collection('customerOrder');
    const customerReviewCollection = database.collection('customerReview');
    const adminsCollection = database.collection('admins');
    console.log('Connected to Database');


    // Add order data
    app.post('/addOrder', (req, res) => {
      const data = req.body;
      customerOrderCollection.insertOne(data).then(result => {
        res.send(result.acknowledged);
      })
    })

    // API For getting customer order data
    app.get('/orderList', (req, res) => {
      customerOrderCollection.find({ email: req.query.email }).toArray().then(result => {
        res.send(result);
      })
    })

    // Customer Review 
    app.post('/postReview', (req, res) => {
      const review = req.body;
      customerReviewCollection.insertOne(review).then(result => {
        res.send(result.acknowledged);
      })
    })

    // All customer Review 
    app.get('/allCustomerReview',(req,res)=>{
      customerReviewCollection.find({}).toArray().then(result =>{
        res.send(result);
      })
    })

    // Make Admin Api
    app.post('/makeAdmin',(req,res)=>{
      const admin = req.body;
      adminsCollection.insertOne(admin).then(result =>{
        res.send(result.acknowledged);
      })
    })



  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})