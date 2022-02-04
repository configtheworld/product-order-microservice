const express = require('express');
const app = express();
const PORT = process.env.AUTH_PORT || 3002;
const mongoose = require('mongoose');
const amqp = require('amqplib');
let channel, connection;

mongoose
  .connect('mongodb://localhost/auth-service', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB configed');
  })
  .catch((err) => {
    console.log('ERROR:', err.message);
  });

async function queue_connect() {
  const amqp_server = 'amqp://localhost:5672';
  connection = await amqp.connect(amqp_server);
  channel = await connection.createChannel();
  await channel.assertQueue('PRODUCT');
}
queue_connect();

app.use(express.json());

app.listen(PORT, () => {
  console.log('product service is on live');
});