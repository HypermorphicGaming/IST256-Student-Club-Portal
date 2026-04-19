# IST256 Student Club Portal

Simple React + Vite portal for student club registration and management.

## Features

- Home dashboard with quick navigation.
- Event catalog with cart workflow.
- Checkout flow that validates inputs and updates event open seats.
- Manage users form and searchable directory.
- Manage events form and searchable directory.
- LocalStorage-backed persistence for frontend-only operation.
- Backend order storage for approval and history workflows.

## Tech Stack

- React
- React Router
- Vite
- Bootstrap 5
- ESLint

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the backend API (from the `backend/` folder):

```bash
npm install
npm start
```

3. Start the frontend development server (from the `frontend/` folder):

```bash
npm run dev
```

4. Open the app at:

```text
http://localhost:5173
```

Backend API default URL:

```text
http://localhost:3000/api/orders
```

## Scripts

- `npm run dev`: Start Vite dev server.
- `npm run build`: Create production build in `dist/`.
- `npm run preview`: Preview production build locally.
- `npm run lint`: Run ESLint checks.

## Project Structure

```text
frontend/
	src/
		App.jsx
		NavBar.jsx
		pages/
			Home.jsx
			CatalogCart.jsx
			Checkout.jsx
			ManageUsers.jsx
			ManageEvents.jsx
			ApprovalPage.jsx
			OrderHistory.jsx
		components/
			PageShell.jsx
			CartItemList.jsx
			Footer.jsx
		utils/
			productUtils.js
			ordersApi.js
			managementForms.js
			testDataUtils.js
backend/
	server.js
	routes/
		orders.js
	orders.json
```

## Data Storage Keys

- `club_users`: Stored user directory records.
- `club_events`: Stored event records.
- `registration_cart`: Active cart entries.

## Notes

- User, event, and cart state use localStorage.
- Order approval/history uses the backend API at `http://localhost:3000/api/orders`.
- Backend order data is stored in `backend/orders.json` as a JSON array.
- Build output in `dist/` is generated and should not be committed.
