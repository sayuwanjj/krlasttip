const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');

// GET все события (с поддержкой query-параметров)
router.get('/', eventsController.getAllEvents);

// GET событие по ID (используем req.params)
router.get('/:id', eventsController.getEventById);

// POST создание нового события
router.post('/', eventsController.createEvent);

// PUT обновление события по ID
router.put('/:id', eventsController.updateEvent);

// DELETE удаление события по ID
router.delete('/:id', eventsController.deleteEvent);

module.exports = router;