const express = require('express');
const router = express.Router();
const { getContacts, createContact, seedContacts, deleteContact, getContactLists } = require('../controllers/contactController');

router.get('/', getContacts);
router.post('/', createContact);
router.post('/seed', seedContacts);
router.get('/lists', getContactLists);
router.delete('/:id', deleteContact);

module.exports = router;
