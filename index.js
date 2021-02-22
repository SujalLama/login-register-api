const express = require('express');
const mongoose= require('mongoose');
require('dotenv').config();

const app = express();

//connect db
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}, () => console.log(`mongodb connected.`))

//middleware
app.use(express.json());

const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);
app.listen(5000, () => console.log(`Server running in port: 5000`));