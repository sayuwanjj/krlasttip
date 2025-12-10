import * as newsService from '../services/newsService.js';

// GET все посты
export const getAllNews = (req, res) => {
    try {
        const category = req.query.category;
        let news = newsService.getAll();
        
        if (category) {
            news = news.filter(item => item.category === category);
        }
        
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET один пост по ID
export const getNewsById = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const news = newsService.getById(id);
        
        if (!news) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST создать пост
export const createNews = (req, res) => {
    try {
        const { title, content, category, image } = req.body;
        
        if (!title || !content || !category) {
            return res.status(400).json({ 
                error: 'Title, content, and category are required' 
            });
        }
        
        const newPost = newsService.create({
            title,
            content,
            category,
            image: image || ''
        });
        
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT обновить пост
export const updateNews = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title, content, category, image } = req.body;
        
        const updatedNews = newsService.update(id, {
            title,
            content,
            category,
            image
        });
        
        if (!updatedNews) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        res.status(200).json(updatedNews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE удалить пост (изменена функция на deleteNews)
export const deleteNews = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        // ✅ ИСПРАВЛЕНО: вызов newsService.deleteNews вместо newsService.delete
        const success = newsService.deleteNews(id);
        
        if (!success) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
