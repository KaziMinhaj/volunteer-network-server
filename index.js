const express = require('express')
const app = express()
const cors=require('cors')
const bodyParser=require('body-parser')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID

const port = process.env.PORT || 5055 ;

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fzhcz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    // console.log("error: ",err);
  const eventsCollection = client.db("volunteer").collection("events");
   
  app.get('/events',(req,res)=>{
    eventsCollection.find()
    .toArray((err,items)=>{
     res.send(items)
    })
  })

  app.post('/addEvent',(req,res)=>{
    const newEvent = req.body;
    eventsCollection.insertOne(newEvent)
    .then(result => {
      console.log(result.insertedCount);
      res.send(result.insertedCount>0)
    })
  })

  app.delete('/deleteEvent/:id',(req,res)=>{
    const id = ObjectID(req.params.id);
    console.log('delete',id);
    eventsCollection.findOneAndDelete({_id:id})
    .then(documents => res.send(documents))
  })
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})