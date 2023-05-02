require('dotenv').config();
const express = require('express');
const sequelize = require('./db');

const PORT = process.env.API_PORT || 5000;

const app = express();

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`server started on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};
