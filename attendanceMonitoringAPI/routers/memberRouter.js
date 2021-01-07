const express = require('express');
const memberController = require('../controllers/memberController');
const { body } = require('express-validator');

const router = express.Router();

router.get('/', memberController.getAllMembers);
router.get('/search/', memberController.getMemberSearch);
router.get('/:id', memberController.getMemberById);
router.post('/', body('name').isLength({ min: 5 }).withMessage('Name must be at least 5 chars long'), memberController.inserMember);
router.put('/:id', memberController.updateMember);
router.delete('/:id', memberController.deleteMember);

module.exports = router;
