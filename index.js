const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require("mongodb");
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
    console.log('Connected to Database');


    // Add order data
    app.post('/addOrder',(req,res)=>{
        const data = req.body;
        customerOrderCollection.insertOne(data).then(result =>{
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