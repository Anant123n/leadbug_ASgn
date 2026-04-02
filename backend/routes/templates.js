const express = require('express');
const router = express.Router();
const { getTemplates, createTemplate, deleteTemplate, getTemplateById } = require('../controllers/templateController');

router.get('/', getTemplates);
router.post('/', createTemplate);
router.get('/:id', getTemplateById);
router.delete('/:id', deleteTemplate);

module.exports = router;
