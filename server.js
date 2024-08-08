const express = require('express');
const cors = require('cors');
const connectDB = require('./db/db');
const ordersRoutes = require('./routes/order');
require('dotenv').config();

const app = express();
const port = 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/', ordersRoutes);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
