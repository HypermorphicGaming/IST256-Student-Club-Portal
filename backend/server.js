const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'orders.json');
const ALLOWED_STATUSES = new Set(['pending', 'approved', 'declined']);

app.use(cors());
app.use(express.json());

async function ensureDataFile() {
	try {
		const raw = await fs.readFile(DATA_FILE, 'utf8');
		if (raw.trim() === '') {
			await fs.writeFile(DATA_FILE, '[]\n', 'utf8');
			return;
		}

		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) {
			throw new Error('orders.json must contain a JSON array.');
		}
	} catch (error) {
		if (error.code === 'ENOENT') {
			await fs.writeFile(DATA_FILE, '[]\n', 'utf8');
			return;
		}
		throw error;
	}
}

async function readOrders() {
	const raw = await fs.readFile(DATA_FILE, 'utf8');
	const parsed = JSON.parse(raw || '[]');
	return Array.isArray(parsed) ? parsed : [];
}

async function writeOrders(orders) {
	await fs.writeFile(DATA_FILE, `${JSON.stringify(orders, null, 2)}\n`, 'utf8');
}

function isValidCreatePayload(payload) {
	if (!payload || typeof payload !== 'object') return false;
	if (!payload.customer || typeof payload.customer !== 'object') return false;
	if (!Array.isArray(payload.items) || payload.items.length === 0) return false;
	if (typeof payload.totalCost !== 'number' || Number.isNaN(payload.totalCost)) return false;
	return true;
}

function buildOrderId() {
	return `ord_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
}

app.post('/registrations', async (req, res) => {
	if (!isValidCreatePayload(req.body)) {
		return res.status(400).json({
			error: 'Invalid registration payload. Expected customer, non-empty items, and numeric totalCost.'
		});
	}

	try {
		const orders = await readOrders();
		const timestamp = new Date().toISOString();

		const orderRecord = {
			id: buildOrderId(),
			...req.body,
			status: 'pending',
			createdAt: timestamp,
			updatedAt: timestamp
		};

		orders.push(orderRecord);
		await writeOrders(orders);
		return res.status(201).json(orderRecord);
	} catch (error) {
		console.error('Failed to create registration:', error);
		return res.status(500).json({ error: 'Failed to save registration.' });
	}
});

app.get('/registrations', async (_req, res) => {
	try {
		const orders = await readOrders();
		return res.json(orders);
	} catch (error) {
		console.error('Failed to read registrations:', error);
		return res.status(500).json({ error: 'Failed to read registrations.' });
	}
});

app.patch('/registrations/:id', async (req, res) => {
	const { id } = req.params;
	const { status } = req.body || {};

	if (!ALLOWED_STATUSES.has(status) || status === 'pending') {
		return res.status(400).json({
			error: 'Invalid status. Allowed values are approved or declined.'
		});
	}

	try {
		const orders = await readOrders();
		const orderIndex = orders.findIndex((order) => String(order.id) === String(id));

		if (orderIndex === -1) {
			return res.status(404).json({ error: 'Registration not found.' });
		}

		const updatedOrder = {
			...orders[orderIndex],
			status,
			updatedAt: new Date().toISOString()
		};

		orders[orderIndex] = updatedOrder;
		await writeOrders(orders);
		return res.json(updatedOrder);
	} catch (error) {
		console.error('Failed to update registration status:', error);
		return res.status(500).json({ error: 'Failed to update registration status.' });
	}
});

app.get('/health', (_req, res) => {
	res.json({ ok: true });
});

async function startServer() {
	try {
		await ensureDataFile();
		app.listen(PORT, () => {
			console.log(`Backend listening on port ${PORT}`);
		});
	} catch (error) {
		console.error('Server startup failed:', error);
		process.exit(1);
	}
}

startServer();
