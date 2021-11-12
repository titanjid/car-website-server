const express=require('express');
const app =express();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require('mongodb');
const port=process.env.PORT || 5000
const cors =require('cors')
require('dotenv').config();



app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mcw6h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{

        await client.connect();

        const database=client.db('carBazar');
        const homeCar=database.collection('homeCar');
        const exploreCar=database.collection('exploreCar');
        const orders =database.collection("orders");
        const users=database.collection("users");

        //get Home ui car
        app.get('/homeCars', async (req, res) => {
            const cursor = homeCar.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        //get Explore ui car
        app.get('/exploreCars', async (req, res) => {
            const cursor = exploreCar.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
        //get ui single home car
        app.get('/singleCar/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const car = await homeCar.findOne(query);
            res.json(car);
        })

        
        //get ui single explore Car
        app.get('/singleCars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cars = await exploreCar.findOne(query);
            res.json(cars);
        })

        //get Oneuser order
        app.get('/orders/:email',async (req,res)=>{
            const email={ email: req.params.email }
            const result=await orders.find(email).toArray();
            console.log(result);
            res.send(result);
        })

       
        
        // add user order
        app.post("/addOrders", async (req, res) => {
            const addOrder=req.body
            const result = await orders.insertOne(addOrder);
            res.send(result);
          });
        // add review
        app.post("/reviews", async (req, res) => {
            const review=req.body
            const result = await orders.insertOne(review);
            res.send(result);
          });
        // Add Car
        app.post("/addCar", async (req, res) => {
            const addCar=req.body
            const result = await exploreCar.insertOne(addCar);
            res.json(result);
          });

          // make as admin an user
          app.put('/user/admin',async(req,res)=>{
              const user=req.body
              const filter={email:user.email};
              const updateDoc={
                  $set:{role:'admin'}
              };
              const result=await users.updateOne(filter,updateDoc);
              res.json(result)
          })

          //Find out admin
          app.get('/user/:email',async(req,res)=>{
              const email=req.params.email
              const query={email:email}
              const user=await users.findOne(query);
              let isAdmin=false;
              if(user?.role==="admin"){
                isAdmin=true
              }
              res.json({admin:isAdmin});
          })

           // save to db user info
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await users.insertOne(user);
            res.json(result);
        });

          //delete user order
          app.delete('/orders/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id: ObjectId(id)}
            const order=await orders.deleteOne(query);
            res.json(order)
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Running Car Bazar Service')
});
app.listen(port,()=>{
    console.log('runnning port',port);
});
