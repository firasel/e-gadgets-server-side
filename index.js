const express=require('express');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectID=require('mongodb').ObjectId;
const cors = require('cors');
const app=express();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lwdhb.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('api is working')
})

client.connect(err => {
    const productCollection = client.db("egadgets").collection("products");
    const orderCollection = client.db("egadgets").collection("orders");

    app.get('/products',(req,res)=>{
        productCollection.find({})
        .toArray((error,documents)=>{
            res.send(documents)
        })
    })

    app.get('/product/:id',(req,res)=>{
        const id=req.params.id;
        productCollection.find({_id: ObjectID(id)})
        .toArray((error,documents)=>{
            res.send(documents[0])
        })
    })

    app.get('/orders/:email',(req,res)=>{
        const email=req.params.email;
        orderCollection.find({userEmail:email})
        .toArray((error,documents)=>{
            res.send(documents)
        })
    })

    app.post('/orderproduct',(req,res)=>{
        const orderDetail=req.body;
        orderCollection.insertOne(orderDetail)
        .then(result=> res.send(result.insertedCount > 0))
    })

    app.post('/addproduct',(req,res)=>{
        const product = req.body;
        productCollection.insertOne(product)
        .then(result=> res.send(result.insertedCount > 0))
    })

    app.delete('/deleteproduct/:id',(req,res)=>{
        const id=req.params.id;
        productCollection.deleteOne({_id:ObjectID(id)})
        .then(result=>res.send(result.deletedCount > 0))
    })
});


app.listen(process.env.PORT || 3001);