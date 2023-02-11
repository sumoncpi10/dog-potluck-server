const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dteuxtf.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const userCollection = client.db('dogputluck').collection('users');
        const productCollection = client.db('dogputluck').collection('product');
        const reviewCollection = client.db('dogputluck').collection('review');
        const questCollection = client.db('dogputluck').collection('quest');
        const blogCollection = client.db('dogputluck').collection('blog');
        const aboutCollection = client.db('dogputluck').collection('about');
        const buttonLinkCollection = client.db('dogputluck').collection('buttonLink');

        // get single user 
        app.get('/user/:username', async (req, res) => {
            // console.log(req.params.username)
            const username = req.params.username;
            const query = { username };
            const user = await userCollection.findOne(query);
            res.send(user);
        })

        // add product 
        app.post('/productAdd', async (req, res) => {
            const newProduct = req.body;
            // console.log('adding new Product', newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });
        // add Quest 
        app.post('/questAdd', async (req, res) => {
            const newProduct = req.body;
            // console.log('adding new Quest', newProduct);
            const result = await questCollection.insertOne(newProduct);
            res.send(result);
        });
        // get Single product 
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })
        // Update product 
        app.put('/product/:id', async (req, res) => {
            const newProduct = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set:
                    newProduct

            }
            const product = await productCollection.updateOne(filter, updatedDoc, options);
            res.send(product);
        })
        // get product 
        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const category = req.query.category;
            const view = req.query.view;
            // console.log('query', req.query);
            let query = '';
            if (category == 'shop') {
                query = {};
            }
            else if (view == 'detail') {
                query = { category };
            }
            else {
                query = { category };
            }
            const cursor = productCollection.find(query);
            let products;
            if (view) {
                products = await cursor.limit(4).toArray();
            }
            else if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                products = await cursor.toArray();
            }

            res.send(products);
        });
        // get  product by collection type
        app.get('/productType/:collection_type', async (req, res) => {
            const collection_type = req.params.collection_type;

            const query = { $or: [{ collection_type }, { collection_type: 'all' }] };
            const cursor = await productCollection.find(query);
            const products = await cursor.limit(8).toArray();
            res.send(products);
        })
        // get  product by collection type
        app.get('/dealsOfTheDay/:deals', async (req, res) => {
            const deals = req.params.deals;

            const query = { dealsOfDay: deals };
            const cursor = await productCollection.find(query);
            const products = await cursor.limit(2).toArray();
            res.send(products);
        })
        // get Home product 
        app.get('/homeProducts', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.sort({ collection_type: -1 }).limit(8).toArray();
            res.send(products);
        });
        // Delete Product 
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })
        // add review 
        app.post('/reviewAdd', async (req, res) => {
            const newReview = req.body;
            // console.log('adding new Review', newReview);
            const result = await reviewCollection.insertOne(newReview);
            res.send(result);
        });
        // get review 
        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { ProductID: id };
            const cursor = reviewCollection.find(query);
            const review = await cursor.toArray();
            res.send(review);
        });

        // Pagination Work

        // page Count
        app.get('/productCount', async (req, res) => {
            const category = req.query.category;
            // console.log('query', req.query);
            let query = '';
            if (category == 'shop') {
                query = {};
            }
            else {
                query = { category };
            }

            const cursor = productCollection.find(query);
            const count = await cursor.count();
            res.send({ count });
        });
        // add Blog 
        app.post('/blogAdd', async (req, res) => {
            const newProduct = req.body;
            // console.log('adding new Blog', newProduct);
            const result = await blogCollection.insertOne(newProduct);
            res.send(result);
        });
        // get Blog 
        app.get('/blogs', async (req, res) => {


            const limit = parseInt(req.query.limit);
            const query = {};
            const cursor = blogCollection.find(query);


            let products = '';
            if (limit == 3) {
                products = await cursor.limit(limit).toArray();
            }
            else {
                products = await cursor.toArray();
            }
            res.send(products);
        });
        // get Single blog 
        app.get('/blog/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await blogCollection.findOne(query);
            res.send(product);
        });
        // Update product 
        app.put('/blog/:id', async (req, res) => {
            const newProduct = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set:
                    newProduct
            }
            const product = await blogCollection.updateOne(filter, updatedDoc, options);
            res.send(product);
        })
        // Delete Message 
        app.delete('/blog/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await blogCollection.deleteOne(query);
            res.send(result);
        })
        // get Messages  
        app.get('/message', async (req, res) => {
            const query = {};
            const cursor = questCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
        // Delete Message 
        app.delete('/quest/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await questCollection.deleteOne(query);
            res.send(result);
        })
        // get Button Link 
        app.get('/ButtonLink/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };

            const product = await buttonLinkCollection.findOne(query);
            res.send(product);

        })
        // Update Button Link 

        app.put('/updateButtonLink/:id', async (req, res) => {
            const newProduct = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set:
                    newProduct
            }
            const product = await buttonLinkCollection.updateOne(filter, updatedDoc, options);
            res.send(product);
        })
        // get About 
        app.get('/abouts', async (req, res) => {
            const query = {};
            const cursor = aboutCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })
        // get About By ID 
        app.get('/about/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await aboutCollection.findOne(query);
            res.send(product);
        })
        // Update About 

        app.put('/about/:id', async (req, res) => {
            const newProduct = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set:
                    newProduct
            }
            const product = await aboutCollection.updateOne(filter, updatedDoc, options);
            res.send(product);
        })
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