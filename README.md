# Sand Social AI App

This project contains a **backend** and a **frontend**. Each part lives in its own
folder with a separate `package.json`. Make sure you run `npm install` in **both**
folders before starting development or building for production.

## Backend

The backend is a Node/Express service written in TypeScript located in the
[`backend`](backend/) folder. It exposes a few API endpoints for fetching
Facebook posts and comments and for generating AI replies using OpenAI.

### Environment variables
Create a `.env` file in the `backend` folder (or set these variables in your
shell) with the following values:

- `FB_ACCESS_TOKEN` – Facebook Graph API access token.
- `PAGE_ID` – ID of the Facebook page to monitor.
- `OPENAI_API_KEY` – API key for OpenAI.
- `PORT` *(optional)* – Port for the backend to listen on (defaults to `3001`).

### Development
```bash
cd backend
npm install
npm run dev
```
This starts the server with `ts-node`.

### Production build
```bash
cd backend
npm install
npm run build
npm start
```
This compiles TypeScript to `dist/` and runs `node dist/server.js`.

## Frontend

The frontend uses React, TypeScript and Vite and lives in the
[`frontend`](frontend/) folder.

### Development
```bash
cd frontend
npm install
npm run dev
```
Open the shown local URL in your browser (usually `http://localhost:5173`).
The frontend expects the backend to be running on `http://localhost:3001`.

### Production build
```bash
cd frontend
npm install
npm run build
npm run preview
```
`npm run preview` serves the built files from the `dist/` folder.

## Running both together
Run the backend and frontend development servers in separate terminals. Make
sure the environment variables are configured before starting the backend.
