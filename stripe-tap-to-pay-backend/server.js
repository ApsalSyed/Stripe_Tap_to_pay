require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);  // modify with your secret key
const app = express();
app.use(express.json());
app.use(cors());

// Endpoint to fetch a connection token
app.get('/connection_token', async (req, res) => {
  try {
    const token = await stripe.terminal.connectionTokens.create();
    res.json({secret: token.secret});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

// Endpoint to create a payment intent
app.post('/create_payment_intent', async (req, res) => {
  try {
    const {amount, currency} = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card_present'],
      capture_method: 'automatic',
    });
    res.json({client_secret: paymentIntent.client_secret});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
