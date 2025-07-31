# Sand Social AI App
This project includes a simple Express backend and a React frontend.

## Backend setup

1. Copy `backend/.env.example` to `backend/.env`:
   
   ```sh
   cp backend/.env.example backend/.env
   ```
2. Fill in the values for `FB_ACCESS_TOKEN`, `PAGE_ID`, and `OPENAI_API_KEY` in `backend/.env`.
3. Install backend dependencies and run the development server:
   
   ```sh
   cd backend && npm install && npm run dev
   ```

The backend reads these environment variables in `src/server.ts` to access Facebook and OpenAI APIs.

## Frontend setup

Install dependencies and start Vite:

```sh
cd frontend && npm install && npm run dev
```

The frontend will connect to the backend running on port 3001 by default.
