const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '../data/events.json');

// Вспомогательная функция для чтения данных
const readData = async () => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { events: [] };
  }
};

// Вспомогательная функция для записи данных
const writeData = async (data) => {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
};

// Получить все события с фильтрацией
exports.getAllEvents = async (req, res) => {
  try {
    const data = await readData();
    let events = data.events;
    
    // Обработка query-параметров
    const { type, date, limit } = req.query;
    
    if (type) {
      events = events.filter(event => event.type === type);
    }
    
    if (date) {
      events = events.filter(event => event.date.startsWith(date));
    }
    
    if (limit) {
      events = events.slice(0, parseInt(limit));
    }
    
    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении событий'
    });
  }
};

// Получить событие по ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readData();
    const event = data.events.find(e => e.id === parseInt(id));
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Событие не найдено'
      });
    }
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Ошибка при получении события'
    });
  }
};

// Создать новое событие
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, type, location } = req.body;
    
    // Валидация
    if (!title || !date || !type) {
      return res.status(400).json({
        success: false,
        error: 'Пожалуйста, укажите заголовок, дату и тип события'
      });
    }
    
    const data = await readData();
    
    // Создание нового события
    const newEvent = {
      id: data.events.length > 0 ? Math.max(...data.events.map(e => e.id)) + 1 : 1,
      title,
      description: description || '',
      date,
      type,
      location: location || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.events.push(newEvent);
    await writeData(data);
    
    res.status(201).json({
      success: true,
      data: newEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Ошибка при создании события'
    });
  }
};

// Обновить событие
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const data = await readData();
    const eventIndex = data.events.findIndex(e => e.id === parseInt(id));
    
    if (eventIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Событие не найдено'
      });
    }
    
    // Обновление события
    data.events[eventIndex] = {
      ...data.events[eventIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await writeData(data);
    
    res.json({
      success: true,
      data: data.events[eventIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Ошибка при обновлении события'
    });
  }
};

// Удалить событие
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const data = await readData();
    const eventIndex = data.events.findIndex(e => e.id === parseInt(id));
    
    if (eventIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Событие не найдено'
      });
    }
    
    // Удаление события
    const deletedEvent = data.events.splice(eventIndex, 1)[0];
    await writeData(data);
    
    res.json({
      success: true,
      data: deletedEvent,
      message: 'Событие успешно удалено'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Ошибка при удалении события'
    });
  }
};