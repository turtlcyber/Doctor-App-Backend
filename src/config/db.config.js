const mongoose = require('mongoose');
const { mongoDbUrl } = require('./config');

const options = {
  maxPoolSize: 4, // Adjust the pool size as needed
};

mongoose.connect(mongoDbUrl, options);

const connectToDatabase = mongoose.connection;
connectToDatabase.on('error', console.error.bind(console, 'connection error:'));
connectToDatabase.once('open', () => {
  console.log('Databse connected');
});

module.exports = connectToDatabase;
