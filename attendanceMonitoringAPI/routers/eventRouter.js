const express = require('express');
const eventController = require('../controllers/eventController');

const router = express.Router();

router.get('/', eventController.getAllEvents);
router.get('/search/', eventController.getEventSearch);
router.get('/export/:id', eventController.getEventExportById);
router.get('/:id', eventController.getEventById);
router.post('/', eventController.inserEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
