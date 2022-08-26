const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dteuxtf.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const userCollection = client.db('dogputluck').collection('users');
        const productCollection = client.db('dogputluck').collection('product');

        // get single user 
        app.get('/user/:username', async (req, res) => {
            console.log(req.params.username)
            const username = req.params.username;
            const query = { username };
            const user = await userCollection.findOne(query);
            res.send(user);
        })

        // add product 
        app.post('/productAdd', async (req, res) => {
            const newProduct = req.body;
            console.log('adding new Product', newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });
        // get Single product 
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })
        // get product 
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello from Dog!')
})

app.listen(port, () => {
    console.log(`Dog app listening on port ${port}`)
})