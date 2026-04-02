const express = require('express');
const router = express.Router();
const { getSequences, createSequence, updateSequence, deleteSequence } = require('../controllers/sequenceController');

router.get('/', getSequences);
router.post('/', createSequence);
router.patch('/:id', updateSequence);
router.delete('/:id', deleteSequence);

module.exports = router;
