const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Drafts
 *   description: Private poll drafting and persistence
 */

/**
 * @swagger
 * /api/drafts:
 *   get:
 *     summary: Retrieve all saved drafts
 *     tags: [Drafts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of your stored drafts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Draft'
 */
router.get('/', auth, async (req, res) => {
  try {
    const drafts = await prisma.draft.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @swagger
 * /api/drafts:
 *   post:
 *     summary: Create or update a poll draft
 *     tags: [Drafts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id: { type: string, description: "UUID of the draft to update (omit for new)" }
 *               title: { type: string, example: "New Community Idea" }
 *               description: { type: string }
 *               candidates: { type: array, items: { type: string } }
 *               endsAt: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Draft secured in database
 */
router.post('/', auth, async (req, res) => {
  try {
    const { id, title, description, candidates, endsAt } = req.body;
    
    let draft;
    if (id) {
      // Verify ownership before updating
      const existing = await prisma.draft.findUnique({ where: { id } });
      if (!existing || existing.userId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized move' });
      }

      draft = await prisma.draft.update({
        where: { id },
        data: {
          title,
          description,
          candidates,
          endsAt: endsAt ? new Date(endsAt) : null
        }
      });
    } else {
      // Create new draft record
      draft = await prisma.draft.create({
        data: {
          title,
          description,
          candidates: candidates || [],
          endsAt: endsAt ? new Date(endsAt) : null,
          userId: req.user.id
        }
      });
    }
    
    res.status(201).json(draft);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @swagger
 * /api/drafts/{id}:
 *   delete:
 *     summary: Remove a draft permanently
 *     tags: [Drafts]
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
 *         description: Deleted successfully
 *       403:
 *         description: Unauthorized
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify ownership before deleting
    const existing = await prisma.draft.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized move' });
    }

    await prisma.draft.delete({
      where: { id }
    });
    
    res.json({ message: 'Draft deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
