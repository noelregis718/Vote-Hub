const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

const session = require('express-session');
const passport = require('passport');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'votehub_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VoteHub API is running' });
});

// Swagger UI Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Import routes
const authRoutes = require('./routes/auth');
const pollRoutes = require('./routes/polls');
const auctionRoutes = require('./routes/auctions');
const draftRoutes = require('./routes/drafts');
const proposalRoutes = require('./routes/proposals');

app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/drafts', draftRoutes);
app.use('/api/proposals', proposalRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
