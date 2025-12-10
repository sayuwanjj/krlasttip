import express from 'express';
import * as newsController from '../controllers/newsController.js';

const router = express.Router();

// GET все посты
router.get('/news', newsController.getAllNews);

// GET один пост по ID
router.get('/news/:id', newsController.getNewsById);

// POST создать новый пост
router.post('/news', newsController.createNews);

// PUT обновить пост
router.put('/news/:id', newsController.updateNews);

// DELETE удалить пост
router.delete('/news/:id', newsController.deleteNews);

export default router;
