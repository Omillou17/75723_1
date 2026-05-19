const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 1. Підключення до локальної MongoDB
// Переконайся, що MongoDB Compass або служба MongoDB запущені!
mongoose.connect('mongodb+srv://marta:zTGZrxNNKes8T5B@cluster0.pcml9hq.mongodb.net/cv_database?retryWrites=true&w=majority')
    .then(() => console.log('Успішно підключено до MongoDB!'))
    .catch(err => console.error('Помилка підключення до MongoDB:', err));

// 2. Створення схем та моделей даних
const MessageSchema = new mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    message: String
});
const Message = mongoose.model('Message', MessageSchema);

const NoteSchema = new mongoose.Schema({
    content: String
});
const Note = mongoose.model('Note', NoteSchema);

// 3. Ендпоінт для отримання даних CV
app.get('/api/cv-data', (req, res) => {
    res.json({
        skills: ["HTML", "CSS", "JavaScript", "SQL", "MongoDB (NoSQL)", "Linux"],
        projects: ["Strona CV", "Baza danych SQL Server", "Baza danych MongoDB"]
    });
});

// 4. Ендпоінт для збереження повідомлення з форми
app.post('/api/contact', async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        await newMessage.save();
        res.json({ success: true, id: newMessage._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Ендпоінти для нотаток (Notes)
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        // Перетворюємо MongoDB `_id` на `id` для сумісності з нашим script.js
        const formattedNotes = notes.map(note => ({ id: note._id, content: note.content }));
        res.json(formattedNotes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/notes', async (req, res) => {
    try {
        const newNote = new Note({ content: req.body.content });
        await newNote.save();
        res.json({ id: newNote._id, content: newNote.content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/notes/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер працює на порту http://localhost:${PORT}`);
});