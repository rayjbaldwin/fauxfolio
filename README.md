# Fauxfolio

Fauxfolio is a web application that lets  users build and simulate stock portfolios in a drag‑and‑drop interface. It fetches historical prices from the Polygon.io API, caches them in PostgreSQL, and visualizes portfolio performance with Chart.js.

## Features

- User Authentication: JWT‑based login & registration with protected API routes.
- Portfolio Management: Create, update, and delete portfolios; drag & drop stocks into your portfolio; adjust share counts.
- Historical Data Caching: Automatically fetch and cache daily close prices for trading days, skipping weekends and holidays.
- Batch & Concurrent Fetching: Speed up data loading by running API requests in parallel.
- Simulation & Visualization: Simulate portfolio value over a fixed date range and display a dynamic line chart that changes color based on performance trend.

## Technology Stack

- Frontend: Angular + Chart.js + Angular Material dialogs
- Backend: Node.js + Express.js + JWT + bcrypt
- Database: PostgreSQL (hosted on AWS)
- APIs & Services: Polygon.io for stock data; date‑holidays for U.S. market calendar

## Setup & Installation

#### Clone the project

```bash
git clone https://github.com/your‑username/fauxfolio.git
cd fauxfolio
```

#### Backend

```bash
cd backend
npm install
npm start     # runs on http://localhost:3000
```

#### Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`JWT_SECRET`

`POLYGON_API_KEY`


#### Frontend

```bash
cd ../frontend
npm install
ng serve      # runs on http://localhost:4200
```

#### To Run Everything at Once

```bash
cd fauxfolio
npm run start:all  # starts both backend server and frontend application
```

## Roadmap

- Deploy fully to AWS with Terraform 
- Add CI/CD pipeline with GitHub Actions
- Expand user experience (User profile management, gamification, etc.)
- Ensure acessibility
- Security
