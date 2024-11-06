// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { 
  submitContact, 
  getContacts, 
  updateContactStatus 
} = require('../controllers/contactController');

router.post('/', submitContact);
router.get('/', getContacts);
// router.put('/:id', updateContactStatus);

module.exports = router;
