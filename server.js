const express = require("express");
const app = express();
const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");

const PORT = 5050;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const MONGO_URL = "mongodb://admin:qwerty@localhost:27017";
const client = new MongoClient(MONGO_URL);
const DB_NAME = "personal-assistant-db";

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db(DB_NAME);
        console.log('Connected successfully to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

connectDB();

// ============ TASKS API ============

app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await db.collection('tasks').find({}).sort({ createdAt: -1 }).toArray();
        res.json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/api/tasks", async (req, res) => {
    try {
        const task = {
            ...req.body,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const result = await db.collection('tasks').insertOne(task);
        res.json({ success: true, data: { _id: result.insertedId, ...task } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put("/api/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const update = { ...req.body, updatedAt: new Date() };
        const result = await db.collection('tasks').updateOne(
            { _id: new ObjectId(id) },
            { $set: update }
        );
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('tasks').deleteOne({ _id: new ObjectId(id) });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ REMINDERS API ============

app.get("/api/reminders", async (req, res) => {
    try {
        const reminders = await db.collection('reminders').find({}).sort({ time: 1 }).toArray();
        res.json({ success: true, data: reminders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/api/reminders", async (req, res) => {
    try {
        const reminder = {
            ...req.body,
            active: true,
            createdAt: new Date()
        };
        const result = await db.collection('reminders').insertOne(reminder);
        res.json({ success: true, data: { _id: result.insertedId, ...reminder } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put("/api/reminders/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.collection('reminders').updateOne(
            { _id: new ObjectId(id) },
            { $set: req.body }
        );
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete("/api/reminders/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('reminders').deleteOne({ _id: new ObjectId(id) });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ NOTES API ============

app.get("/api/notes", async (req, res) => {
    try {
        const notes = await db.collection('notes').find({}).sort({ updatedAt: -1 }).toArray();
        res.json({ success: true, data: notes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/api/notes", async (req, res) => {
    try {
        const note = {
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const result = await db.collection('notes').insertOne(note);
        res.json({ success: true, data: { _id: result.insertedId, ...note } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put("/api/notes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const update = { ...req.body, updatedAt: new Date() };
        const result = await db.collection('notes').updateOne(
            { _id: new ObjectId(id) },
            { $set: update }
        );
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete("/api/notes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('notes').deleteOne({ _id: new ObjectId(id) });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Personal Assistant server running on port ${PORT}`);
});