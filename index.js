const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z2l8a.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 5000



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("emaJohn").collection("products");
  const ordersCollection = client.db("emaJohn").collection("orders");

  app.post('/addProduct', (req, res) => {
      const product = req.body;
    //   console.log(product);
      collection.insertOne(product)
      .then(result => {
          console.log(result.insertedCount);
          res.send(result.insertedCount)
      })
  })

  app.get('/products', (req, res) => {
    collection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/products/:key', (req, res) => {
    collection.find({key : req.params.key})
    .toArray((err, documents) => {
      res.send(documents[00]);
    })
  })

  app.post('/productsByKey', (req, res) => {
    const productKeys = req.body;
    collection.find({key : { $in: productKeys}})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
  //   console.log(product);
    ordersCollection.insertOne(order)
    .then(result => {
        // console.log(result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})

});


// console.log(process.env.DB_USER)  >>> to check the connection of environment variable(dotenv)

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(process.env.PORT || port)