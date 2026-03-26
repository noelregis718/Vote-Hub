const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Create an Auction
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, startingBid, endsAt, image } = req.body;
    
    const auction = await prisma.auction.create({
      data: {
        title,
        description,
        startingBid: parseFloat(startingBid),
        currentBid: parseFloat(startingBid),
        image,
        userId: req.user.id,
        endsAt: new Date(endsAt)
      }
    });
    
    res.status(201).json(auction);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get All Active Auctions
router.get('/', async (req, res) => {
  try {
    const auctions = await prisma.auction.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { bids: true } },
        createdBy: { select: { name: true, avatar: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(auctions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Place a Bid
router.post('/:id/bid', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const { id } = req.params;

    const auction = await prisma.auction.findUnique({
      where: { id },
      include: { bids: { orderBy: { amount: 'desc' }, take: 1 } }
    });

    if (!auction || !auction.isActive) {
      return res.status(404).json({ message: 'Auction not found or inactive' });
    }

    if (new Date() > new Date(auction.endsAt)) {
      return res.status(400).json({ message: 'Auction has ended' });
    }

    const minBid = auction.bids[0] ? auction.bids[0].amount + 1 : auction.startingBid;
    if (parseFloat(amount) < minBid) {
      return res.status(400).json({ message: `Bid must be at least ₹${minBid}` });
    }

    const bid = await prisma.bid.create({
      data: {
        amount: parseFloat(amount),
        userId: req.user.id,
        auctionId: id
      }
    });

    // Update current bid in auction
    await prisma.auction.update({
      where: { id },
      data: { currentBid: parseFloat(amount) }
    });

    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update an Auction
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, startingBid, endsAt, image } = req.body;
    const { id } = req.params;

    const existing = await prisma.auction.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to edit this auction' });
    }

    const auction = await prisma.auction.update({
      where: { id },
      data: {
        title,
        description,
        startingBid: parseFloat(startingBid),
        image,
        endsAt: new Date(endsAt)
      }
    });

    res.json(auction);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete an Auction
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.auction.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this auction' });
    }

    await prisma.auction.delete({ where: { id } });
    res.json({ message: 'Auction deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
