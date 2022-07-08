const express = require("express");

const cors = require("cors");
var jwt = require("jsonwebtoken");
require("dotenv").config();


const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 9500;

const app = express();

app.use(express.json());
app.use(cors());
const uri = `mongodb+srv://user:uQQYnj676ysICqUT@cluster0.ujkkm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});



app.get("/", (req, res) => {
  res.send("Hello, server is running");
}); 

async function run(){
    try{
      await client.connect();

      const productcollection = client.db("unique").collection("products");
      const ordercollection = client.db("unique").collection("ordercollection");

      console.log("database connected successfully");

      app.get("/products", async (req, res) => {
        const categories = req.query.categories;

        const query = { categories };

        const cursor = productcollection.find(query);
        const products = await cursor.toArray();
        res.send(products);
      });

      app.get("/products/find/:id", async (req, res) => {
        const id = req.params.id;

        const query = { _id: ObjectId(id) };
        const order = await productcollection.findOne(query);
        res.send(order);
      });

     
    }
    catch(err){

    }
}

run().catch(console.dir);



app.listen(port, () => {
  console.log("server is running");
});