const express=require('express');
const app =express();
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

        app.get('/homeCars', async (req, res) => {
            const cursor = homeCar.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get('/exploreCars', async (req, res) => {
            const cursor = exploreCar.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
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
