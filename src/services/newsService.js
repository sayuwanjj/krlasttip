let news = [
    {
        id: 1,
        title: 'Express.js - мощный фреймворк для Node.js',
        content: 'Express.js является одним из самых популярных веб-фреймворков для Node.js. Он предоставляет минималистичный, но мощный набор инструментов для создания веб-приложений и API.',
        category: 'Технология',
        image: '📱',
        createdAt: new Date().toISOString(),
        views: 245
    },
    {
        id: 2,
        title: 'Новые возможности JavaScript ES2024',
        content: 'В 2024 году JavaScript получил множество новых фич, которые делают разработку еще более удобной. Узнайте о самых интересных обновлениях языка.',
        category: 'Разработка',
        image: '💻',
        createdAt: new Date().toISOString(),
        views: 512
    },
    {
        id: 3,
        title: 'REST API лучшие практики',
        content: 'Правильное проектирование REST API является ключевым аспектом разработки веб-приложений. В этой статье мы рассмотрим основные принципы и практики.',
        category: 'Гайды',
        image: '🚀',
        createdAt: new Date().toISOString(),
        views: 678
    }
];

let nextId = 4;

export const getAll = () => {
    return news.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getById = (id) => {
    return news.find(item => item.id === id);
};

export const create = (newsData) => {
    const newPost = {
        id: nextId++,
        ...newsData,
        createdAt: new Date().toISOString(),
        views: 0
    };
    
    news.push(newPost);
    return newPost;
};

export const update = (id, newsData) => {
    const post = news.find(item => item.id === id);
    
    if (!post) {
        return null;
    }
    
    Object.assign(post, newsData);
    post.updatedAt = new Date().toISOString();
    
    return post;
};

export const deleteNews = (id) => {
    const index = news.findIndex(item => item.id === id);
    
    if (index === -1) {
        return false;
    }
    
    news.splice(index, 1);
    return true;
};
