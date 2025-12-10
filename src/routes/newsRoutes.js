import express from 'express';
import * as newsController from '../controllers/newsController.js';

const router = express.Router();

router.get('/news', newsController.getAllNews);

router.get('/news/:id', newsController.getNewsById);

router.post('/news', newsController.createNews);

router.put('/news/:id', newsController.updateNews);

router.delete('/news/:id', newsController.deleteNews);

export default router;
