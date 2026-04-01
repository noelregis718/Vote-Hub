const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Auctions
 *   description: Premium eAuction and bidding platform
 */

/**
 * @swagger
 * /api/auctions:
 *   post:
 *     summary: Create a new auction
 *     tags: [Auctions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, startingBid, endsAt]
 *             properties:
 *               title: { type: string, example: "Vintage UI Asset Collection" }
 *               description: { type: string, example: "Exclusive high-fidelity design resources" }
 *               startingBid: { type: number, example: 5000 }
 *               endsAt: { type: string, format: date-time }
 *               image: { type: string, example: "base64-image-string" }
 *     responses:
 *       201:
 *         description: Auction created successfully
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/auctions:
 *   get:
 *     summary: Get all active auctions
 *     tags: [Auctions]
 *     responses:
 *       200:
 *         description: List of live auctions with bid counts
 */
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

/**
 * @swagger
 * /api/auctions/{id}/bid:
 *   post:
 *     summary: Place a bid on a live auction
 *     tags: [Auctions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the auction to bid on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount: { type: number, example: 5100 }
 *     responses:
 *       201:
 *         description: Bid accepted
 *       400:
 *         description: Bid too low or time expired
 */
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
