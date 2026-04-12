const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

const FILE = 'registrations.json';

// Middleware
app.use(cors());
app.use(express.json());

function readData() {
    if (!fs.existsSync(FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(FILE, 'utf8'));
    } catch (err) {
        return [];
    }
}

function writeData(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}


app.post('/registrations', (req, res) => {
    const registrations = readData();

    const newRegistration = {
        id: Date.now(),
        ...req.body,
        status: "pending"
    };

    registrations.push(newRegistration);
    writeData(registrations);

    res.status(201).json({
        message: "Registration saved successfully",
        registration: newRegistration
    });
});


app.get('/registrations', (req, res) => {
    res.json(readData());
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});