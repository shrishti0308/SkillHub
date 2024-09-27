const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');  // Add this to manage file paths

const app = express();
const PORT = 3000;

const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const jobRoutes = require('./routes/jobRoutes');
const bidRoutes = require('./routes/bidRoutes');
const projectRoutes = require('./routes/projectRoutes');
const walletRoutes = require('./routes/walletRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const { default: mongoose } = require('mongoose');
const bid = require('./models/bid');
const { authenticateJWT } = require('./middlewares/authMiddleware');


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
app.use('/jobs', jobRoutes);
app.use('/bids', bidRoutes);
app.use('/review', reviewRoutes);
app.use('/project', projectRoutes);
app.use('/wallet', walletRoutes);
app.use('/transaction', transactionRoutes);

app.get('/recent-bids', authenticateJWT, async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const freelancerObjectId = new mongoose.Types.ObjectId(freelancerId);

    const recentBids = await bid.find({ freelancer: freelancerObjectId });

    res.status(200).json({ recentBids });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving recent bids', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
