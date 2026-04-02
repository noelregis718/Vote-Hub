const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Proposals
 *   description: Community project proposals and impact tracking
 */

/**
 * @swagger
 * /api/proposals:
 *   post:
 *     summary: Create a new community proposal
 *     tags: [Proposals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, goal]
 *             properties:
 *               title: { type: string, example: "Community Garden Project" }
 *               description: { type: string, example: "Transforming the vacant lot into a green space." }
 *               goal: { type: string, example: "To provide fresh produce and a public gathering spot." }
 *               budget: { type: number, example: 5000.00 }
 *     responses:
 *       201:
 *         description: Proposal created
 *       500:
 *         description: Server error
 */
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, goal, budget, targetSupports } = req.body;
    
    const proposal = await prisma.proposal.create({
      data: {
        title,
        description,
        goal,
        budget: budget ? parseFloat(budget) : null,
        targetSupports: targetSupports ? parseInt(targetSupports) : 100,
        userId: req.user.id
      }
    });
    
    res.status(201).json(proposal);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @swagger
 * /api/proposals:
 *   get:
 *     summary: Get all community proposals
 *     tags: [Proposals]
 *     responses:
 *       200:
 *         description: List of proposals
 */
router.get('/', async (req, res) => {
  try {
    const proposals = await prisma.proposal.findMany({
      include: {
        _count: { select: { supports: true } },
        supports: true,
        createdBy: { select: { name: true, avatar: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @swagger
 * /api/proposals/{id}/support:
 *   post:
 *     summary: Toggle support for a proposal
 *     tags: [Proposals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Support toggled successfully
 */
/**
 * @swagger
 * /api/proposals/{id}:
 *   put:
 *     summary: Update an existing community proposal
 *     tags: [Proposals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               goal: { type: string }
 *               budget: { type: number }
 *               targetSupports: { type: number }
 *     responses:
 *       200:
 *         description: Proposal updated successfully
 *       403:
 *         description: Unauthorized to edit this proposal
 *       404:
 *         description: Proposal not found
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, goal, budget, targetSupports } = req.body;

    const proposal = await prisma.proposal.findUnique({ where: { id } });
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
    
    if (proposal.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: You can only edit your own proposals' });
    }

    const updatedProposal = await prisma.proposal.update({
      where: { id },
      data: {
        title,
        description,
        goal,
        budget: budget ? parseFloat(budget) : null,
        targetSupports: targetSupports ? parseInt(targetSupports) : 100
      }
    });

    res.json(updatedProposal);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/:id/support', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if proposal exists
    const proposal = await prisma.proposal.findUnique({ where: { id } });
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    const existingSupport = await prisma.proposalSupport.findUnique({
      where: { userId_proposalId: { userId, proposalId: id } }
    });

    if (existingSupport) {
      await prisma.proposalSupport.delete({
        where: { id: existingSupport.id }
      });
      return res.json({ message: 'Support removed', supported: false });
    } else {
      await prisma.proposalSupport.create({
        data: { userId, proposalId: id }
      });
      return res.json({ message: 'Support added', supported: true });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
