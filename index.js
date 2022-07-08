const express = require("express");

const cors = require("cors");
var jwt = require("jsonwebtoken");
require("dotenv").config();

const stripe = require("stripe")(
  "  sk_test_51L3crVI20gp0i97mRSUa6lJ5ZbgZAnYdK9cAoJ13JyFAXlVKpyKTm2F2Lb58MrCmc9GhUEWnW7nPprb3C2VelXbO00iJZ5Iefm"
);
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

      // posting a order order
      app.post("/order", async (req, res) => {
        const newService = req.body;
        const result = await ordercollection.insertOne(newService);
        res.send(result);
      });

      // getting individual orders
      app.get("/myorder", async (req, res) => {
        const email = req.query.email;
        const query = { email: email };
        const cursor = ordercollection.find(query);
        const orders = await cursor.toArray();
        res.send(orders);
      });

      // getting order for payment
      app.get("/order/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const order = await ordercollection.findOne(query);
        res.send(order);
      });

      // stripe payment
      app.post("/create-payment-intent", async (req, res) => {
        const service = req.body;
        const price = service.price;
        console.log(price)
        const amount = price * 100;
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "usd",
          payment_method_types: ["card"],
        });
        res.send({ clientSecret: paymentIntent.client_secret });
      });
    }
    catch(err){

    }
}

run().catch(console.dir);



app.listen(port, () => {
  console.log("server is running");
});