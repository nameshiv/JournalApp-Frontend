# Journal — React Frontend

React + TypeScript frontend for the Journal application.

### Tech Stack

React · TypeScript · Vite · Axios · React Router · Tailwind CSS

### Features

* Authentication with JWT
* Journal entry management
* User profile management
* Sentiment analysis
* Weather
* Admin dashboard

### Setup

```bash
npm install
npm run dev
```

Create `.env`:

```env
VITE_API_BASE_URL=<BACKEND_URL>
```

The frontend communicates with the Spring Boot backend through the configured API URL.

### Production

Set `VITE_API_BASE_URL` to the deployed backend URL when deploying the frontend.
