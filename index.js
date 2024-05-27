const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

dotenv.config();  // Load environment variables

const app = express();

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

// Log the environment variables to ensure they are loaded correctly
console.log('Environment Variables:');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('EMAIL_USER:', process.env.EMAIL_USER);

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error('MongoDB connection string is not defined.');
    process.exit(1);
}

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB successfully');
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch(error => {
        console.error('Connection error:', error.message);
        process.exit(1);
    });


