const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



// user: mydbuser1
// pass: tZDZkzcGOa8nr4VQ




const uri = "mongodb+srv://mydbuser1:tZDZkzcGOa8nr4VQ@cluster0.zsx3s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("foodMaster");
        const usersCollection = database.collection("users");


        //get api
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
            console.log('load user with id:', id);
            res.send(user);
        })


        //Post api
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser)
            // console.log('got new user', req.body);
            // console.log('added user', result);
            res.json(result);
        });


        // update api / put
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    email: updateUser.email
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options)


            console.log('updating user', id);
            res.json(result);
        })


        //delete api
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);

            res.json(result)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);











app.get('/', (req, res) => {
    res.send('running my crud server');
});

app.listen(port, () => {
    console.log('Running Server on port', port);
})


