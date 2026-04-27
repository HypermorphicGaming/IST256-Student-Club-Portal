# IST256 Student Club Portal

Monorepo for the Student Club Portal application.

## Overview

This repository contains:

- `frontend/`: React + Vite application for registration, management, checkout, and order history.
- `backend/`: Express + Mongoose API for orders and CRUD endpoints for core entities.

## Tech Stack

- Frontend: React, Vite, React Router, Bootstrap, ESLint
- Backend: Node.js, Express, Mongoose, dotenv, CORS

## Project Structure

```text
backend/
  db.js
  server.js
  models/
  routes/
  orders.json
frontend/
  src/
  public/
  index.html
```

## Getting Started

### 1) Install dependencies

```bash
npm --prefix backend install
npm --prefix frontend install
```

### 2) Configure environment

Backend uses `MONGODB_URI` from `backend/.env`.

Example:

```bash
MONGODB_URI=mongodb://localhost:27017/student-club-portal
PORT=3000
```

If MongoDB is unavailable, order routes fall back to `backend/orders.json`.

### 3) Run the backend

```bash
npm --prefix backend start
```

### 4) Run the frontend

```bash
npm --prefix frontend run dev
```

Frontend default URL:

```text
http://localhost:5173
```

Backend health endpoint:

```text
http://localhost:3000/health
```

## API Endpoints

- `/api/orders`
- `/api/events`
- `/api/users`
- `/api/shopper`
- `/api/products`
- `/api/shopping_cart`
- `/api/returns`

## Quality Commands

```bash
npm --prefix frontend run lint
npm --prefix frontend run build
```

## Data Storage

Frontend localStorage keys:

- `club_users`
- `club_events`
- `registration_cart`

Backend fallback order storage:

- `backend/orders.json`
