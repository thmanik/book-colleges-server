const express= require('express')
const cors= require('cors')
const app= express()
require('dotenv').config()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware
app.use(cors())
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vzgfrzr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

   const collegeCollection=client.db('bookCollegees').collection('collegelist')
   const usersInfoCollection=client.db('bookCollegees').collection('usersInfo')

   
  app.get('/allColleges', async(req, res)=>{
    const result=await collegeCollection.find().toArray();
    res.send(result)
  })

  app.get('/allColleges/:id',async(req, res)=>{
    const id=req.params.id;
    const query={_id: new ObjectId(id)}
    const result= await collegeCollection.findOne(query)
    res.send(result)
  })
  app.get('/collegeSearchByCollegeName/:text',async(req,res)=>{
    const searchCollege=req.params.text;
    console.log("We are searching",searchCollege)
    const result =await collegeCollection.find({
      $or:[
        {college_name:{$regex :searchCollege, $options:"i"}}
      ]
    }).toArray();
    res.send(result)
  })

  app.get('/applyForm/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id: new ObjectId(id)}
    const result= await collegeCollection.findOne(query)
    res.send(result)
  })

 

  app.post('/userInfo', async(req, res)=>{
    const user=req.body;
    console.log('new user',user)
    const result=await usersInfoCollection.insertOne(user);
    res.send(result)
  })

  app.get('/mycollege',async(req, res)=>{
    const result = await usersInfoCollection.find({email:req.query.email}).toArray()
    console.log(result)
    res.send(result)
  })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// app.use(cors({
//   origin: 'http://localhost:5173',
// }));
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });




app.get('/', (req, res)=>{
    res.send('Book College server is running....')
})

app.listen(port, ()=>{
    console.log(`server is runnig on port:${port}`)
})