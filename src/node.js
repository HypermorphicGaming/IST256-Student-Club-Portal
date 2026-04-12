const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const FILE = 'orders.json';

app.use(cors());
app.use(express.json());

function readOrders() {
    if (!fs.existsSync(FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(FILE));
    } catch (err) {
        return [];
    }
}

function writeOrders(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

