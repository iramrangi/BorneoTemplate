const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const stripe = require('stripe')('your_stripe_secret_key_here'); // Replace with your Stripe secret key
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory user store (for demo purposes)
const users = [];
// In-memory orders store
const orders = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'your_secret_key_here',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Serve static files
app.use(express.static(path.join(__dirname)));

// User registration
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.json({ message: 'User registered successfully' });
});

// User login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }
  req.session.user = { username };
  res.json({ message: 'Login successful' });
});

// User logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// Create Stripe payment intent
app.post('/api/create-payment-intent', isAuthenticated, async (req, res) => {
  const { amount, currency = 'usd' } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Place order
app.post('/api/orders', isAuthenticated, (req, res) => {
  const { templateTitle, price, buyerName, buyerEmail } = req.body;
  if (!templateTitle || !price || !buyerName || !buyerEmail) {
    return res.status(400).json({ error: 'Missing order details' });
  }
  const order = {
    id: orders.length + 1,
    username: req.session.user.username,
    templateTitle,
    price,
    buyerName,
    buyerEmail,
    date: new Date()
  };
  orders.push(order);
  res.json({ message: 'Order placed successfully', order });
});

// Serve purchase.html for purchase page route
app.get('/purchase.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'purchase.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
