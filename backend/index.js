const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

const port = process.env.PORT;

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Mongodb connected'))
.catch((err) => console.error('Mongodb connection refused: ', err));

app.use('/api', require('./middleware/uploadImage'));
app.use('/api', require('./routes/productRoute'));
app.use('/api/auth', require('./routes/authRoute'));

app.listen(port);
console.log(`Server is Running. Port: ${port}`);