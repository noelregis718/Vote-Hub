const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Polls
 *   description: Community voting and poll management
 */

/**
 * @swagger
 * /api/polls:
 *   post:
 *     summary: Create a new poll
 *     tags: [Polls]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, candidates]
 *             properties:
 *               title: { type: string, example: "Best UI Library 2026" }
 *               description: { type: string, example: "Vote for the future of web dev" }
 *               candidates: { type: array, items: { type: string }, example: ["React", "Vue", "Solid"] }
 *               endsAt: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Poll created
 *       500:
 *         description: Server error
 */
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, candidates, endsAt } = req.body;
    
    const poll = await prisma.poll.create({
      data: {
        title,
        description,
        userId: req.user.id,
        endsAt: endsAt ? new Date(endsAt) : null,
        candidates: {
          create: candidates.map(name => ({ name }))
        }
      },
      include: { candidates: true }
    });
    
    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @swagger
 * /api/polls:
 *   get:
 *     summary: Get all active polls
 *     tags: [Polls]
 *     responses:
 *       200:
 *         description: List of active polls
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Poll'
 */
router.get('/', async (req, res) => {
  try {
    const polls = await prisma.poll.findMany({
      where: { isActive: true },
      include: { 
        candidates: {
          include: { _count: { select: { votes: true } } }
        },
        _count: { select: { votes: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/polls/{pollId}/vote:
 *   post:
 *     summary: Cast a vote in a poll
 *     tags: [Polls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pollId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [candidateId]
 *             properties:
 *               candidateId: { type: string, example: "uuid-candidate-id" }
 *     responses:
 *       201:
 *         description: Vote successful
 *       400:
 *         description: Already voted
 *       404:
 *         description: Not found
 */
router.post('/:pollId/vote', auth, async (req, res) => {
  try {
    const { candidateId } = req.body;
    const { pollId } = req.params;

    // Check if poll exists and is active
    const poll = await prisma.poll.findUnique({ where: { id: pollId } });
    if (!poll || !poll.isActive) return res.status(404).json({ message: 'Poll not found or inactive' });

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: { userId_pollId: { userId: req.user.id, pollId } }
    });
    if (existingVote) return res.status(400).json({ message: 'You have already voted in this poll' });

    const vote = await prisma.vote.create({
      data: {
        userId: req.user.id,
        pollId,
        candidateId
      }
    });

    res.status(201).json({ message: 'Vote cast successfully', vote });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update a Poll
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, candidates, endsAt } = req.body;
    const { id } = req.params;

    const existing = await prisma.poll.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to edit this poll' });
    }

    // Use transaction to ensure consistency
    const poll = await prisma.$transaction(async (tx) => {
      // If candidates are being changed, we MUST clear votes or update carefully
      // For simplicity, we'll reset votes if candidates are provided/re-created
      if (candidates && candidates.length > 0) {
        await tx.vote.deleteMany({ where: { pollId: id } });
        await tx.candidate.deleteMany({ where: { pollId: id } });
      }

      return tx.poll.update({
        where: { id },
        data: {
          title,
          description,
          endsAt: endsAt ? new Date(endsAt) : null,
          ...(candidates && candidates.length > 0 && {
            candidates: {
              create: candidates.map(c => ({ name: typeof c === 'string' ? c : c.name }))
            }
          })
        },
        include: { candidates: true }
      });
    });

    res.json(poll);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete a Poll
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.poll.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this poll' });
    }

    // Delete associated votes and candidates first (or rely on Cascade if set)
    // Since we didn't specify Cascade in schema, let's do it manually or assume Cascade
    await prisma.$transaction([
      prisma.vote.deleteMany({ where: { pollId: id } }),
      prisma.candidate.deleteMany({ where: { pollId: id } }),
      prisma.poll.delete({ where: { id } })
    ]);

    res.json({ message: 'Poll deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
