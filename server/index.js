const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');  // Add this to manage file paths

const app = express();
const PORT = 3000;

const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

connectDB();

// Define the allowed origin (update with your frontend URL)
const corsOptions = {
  origin: 'http://localhost:5173', // Allow your frontend
  credentials: true, // Allow credentials
};

app.use(cors(corsOptions)); // Use CORS with options
app.use(express.json());

// Host the public folder statically
app.use('/public', express.static(path.join(__dirname, 'public')));

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello, My lord!');
});

app.use('/user', userRoutes);
app.use('/review', reviewRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
