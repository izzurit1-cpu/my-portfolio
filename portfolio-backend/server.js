const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');

// Если базы данных JSON еще нет, создаем её с начальными данными
if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
        name: "Александр",
        bio: "Разработчик. Изучаю автоматизацию на Python и Full-stack разработку.",
        themeColor: "#6366f1",
        projects: [
            { id: 1, title: "Мой первый проект", desc: "Описание тестового проекта" }
        ]
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

// Получить данные
app.get('/api/portfolio', (req, res) => {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
});

// Сохранить изменения из админки
app.post('/api/portfolio', (req, res) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));