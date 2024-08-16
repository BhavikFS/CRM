const csv = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const User = require('./Models/User'); // Adjust the path

mongoose.connect('mongodb+srv://bhavikfs22:MUoCC3LotV4Z5zBz@cluster0.dbrjpil.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/CRM', { useNewUrlParser: true, useUnifiedTopology: true });

fs.createReadStream('./upload.csv')
  .pipe(csv())
  .on('data', async (row) => {
    try {
      const userData = {
        username: row.username,
        email: row.email,
        password: row.password, // Store the plain password
        role: row.role
      };

      const user = new User(userData);
      await user.save();
    } catch (err) {
      console.error(err);
    }
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

  
