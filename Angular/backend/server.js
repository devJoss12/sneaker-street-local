const express = require('express');
const stripe = require('stripe')('sk_test_51QF9fJ2LbbVNJuW3LBkS67BZPmY5kjLsWJ7vnD7nSywxj3dzLf3HF4K5HSw397FbOV78w4jr5s3mUwaTT7vkyAzo006WzqShwL');
const bodyParser = require('body-parser');
const cors = require('cors'); // Añadir cors
const app = express();

app.use(cors()); // Usar cors para permitir todas las solicitudes
app.use(bodyParser.json());

app.post('/charge', async (req, res) => {
  try {
    let { token, amount } = req.body;
    let charge = await stripe.charges.create({
      amount: amount,
      currency: 'usd',
      source: token.id,
      description: 'Compra de tenis'
    });
    res.status(200).send(charge);
  } catch (error) {
    console.error('Error al procesar el cargo:', error);
    res.status(500).send(error);
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});
