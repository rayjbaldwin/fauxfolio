# Fauxfolio

Fauxfolio is a web application that lets  users build and simulate stock portfolios in a drag‑and‑drop interface. It fetches historical prices from the Polygon.io API, caches them in PostgreSQL, and visualizes portfolio performance with Chart.js.

## Features

- User Authentication: JWT‑based login & registration with protected API routes.
- Portfolio Management: Create, update, and delete portfolios; drag & drop stocks into your portfolio; adjust share counts.
- Historical Data Caching: Automatically fetch and cache daily close prices for trading days, skipping weekends and holidays.
- Batch & Concurrent Fetching: Speed up data loading by running API requests in parallel.
- Simulation & Visualization: Simulate portfolio value over a fixed date range and display a dynamic line chart that changes color based on performance trend.

## Technology Stack

- Frontend: Angular + Chart.js + Angular Material dialogs + Particles.js
- Backend: Node.js + Express.js + JWT + bcrypt
- Database: PostgreSQL (hosted on AWS RDS)
- APIs & Services: Polygon.io for stock data; date‑holidays for U.S. market calendar

## Setup & Installation

#### Clone the project

```bash
  git clone https://github.com/rayjbaldwin/fauxfolio.git
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


## API Reference

⚠️ Authentication Required ⚠️

All endpoints except /api/auth/register and /api/auth/login require a valid JWT token.

Include the following header in your requests:

``` Bash
Authorization: Bearer your-jwt-token-here
```

### Stock Date

#### Fetch Stock Information and Store

```Bash
  POST /api/stocks/history
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `ticker` | `string` | **Required**. Stock ticker symbol (e.g., "GOOG") |
| `startDate`| `string` | **Required**. Start date in 'YYYY-MM-DD' format |
| `endDate`| `string` | **Required**. End date in 'YYYY-MM-DD' format |


### Portfolios

#### Create a Portfolio

```Bash
  POST /api/portfolios
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `user_id`      | `string` | **Required**. ID of user creating the portfolio |
| `name`      | `string` | **Required**. Name of the portfolio |

#### Get Portfolio Details

```Bash
  GET /api/portfolios/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. ID of portfolio to fetch |

#### Update Portfolio

```Bash
  PUT /api/portfolios/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. ID of portfolio to update |


#### Remove Stock from Portfolio

```Bash
  DELETE /api/portfolios/${id}/stocks/${ticker}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. ID of portfolio |
| `ticker`      | `string` | **Required**. Ticker symbol of stock to remove |

#### Simulate Portfolio Performance

```Bash
  GET /api/portfolios/${id}/simulate?startDate=${startDate}&endDate=${endDate}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. ID of portfolio to simulate |
| `startDate`| `string` | **Required**. Start date in 'YYYY-MM-DD' format |
| `endDate`| `string` | **Required**. End date in 'YYYY-MM-DD' format |


### User Management

#### Register User

```Bash
  POST /api/auth/register
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. Username for the new account |
| `email`      | `string` | **Required**. Email address |
| `password`      | `string` | **Required**. Password |


#### User Login

```Bash
  POST /api/auth/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**. Email address |
| `password`      | `string` | **Required**. Password |



## Future Roadmap

- Deploy fully to AWS with Terraform 
- Add CI/CD pipeline with GitHub Actions
- Expand user experience (User profile management, gamification, etc.)
- Ensure acessibility
- Security
