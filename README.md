## Catering App

### Description

Test Project interview CFactory yang dibuat dengan menggunakan mono repo via docker-compose dengan ruang lingkup 3 service yaitu frontend, backend, dan admin.

---

### Task

Demo Integration

- Deployment via Vercel
- Backend via nodeJS hosting
- Dukungan mode sandbox (Stripe API)
- Dukungan Payment Gateway internasional (Stripe API)
- Mendukung utk notifikasi email (Stripe API)

Additional Feature

- Support Responsiveness Mobile First on Page both frontend and admin
- Well REST Documentation via Swagger
- Standard JWT enhancement
- AI Interaction backed by Gemini 2.0-lite

Code quality

- TSX Support for safe typing
- Standardized SonarQube Linting
- MongoDB Robust Collection
- Atomic Component Structure
- Containerization ready

Limitation

- Unit test belum tersedia
- Rupiah pada stripe belum tersedia di mode sandbox
- Nominal mungkin tidak sesuai dengan harga produk
- UI masih tergolong standard
- Text to speech (vice versa) belum tersedia
- Chatbot belum mengingat konversasi
- Belum terintegrasi websocket (realtime notification)

---

### Features

- User Panel
- Admin Panel
- JWT Authentication
- Password Hashing with Bcrypt
- Stripe Payment Integration
- Login/Signup
- Logout
- Add to Cart
- Place Order
- Order Management
- Products Management
- Filter Food Products
- Login/Signup
- Authenticated APIs
- REST APIs
- Beautiful Alerts

### Tech Stack

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Node.js](https://nodejs.org/en)
- [Express.js](https://expressjs.com/)
- [Mongodb](https://www.mongodb.com/)
- [Stripe](https://stripe.com/)
- [JWT-Authentication](https://jwt.io/introduction)
- [Multer](https://www.npmjs.com/package/multer)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)

### Installation

### Automatically Via Docker

Start the project with docker-compose

```bash
    docker-compose up --build -d
```

Stop the project with docker-compose

```bash
    docker-compose down
```

#### Manual

Install dependencies (frontend)

```bash
    cd frontend
    npm install
```

Install dependencies (admin)

```bash
    cd admin
    npm install
```

Install dependencies (backend)

```bash
    cd backend
    npm install
```

---

### Credentials

> I am include the env in git repo. Please do not abuse it.

| Feature      | Web         | Credentials         |
| ------------ | ----------- | ------------------- |
| VISA Sandbox | Stripe      | 4242 4242 4242 4242 |
| VISA CVC     | Stripe      | 123                 |
| VISA Expired | Stripe      | 12/27               |
| Admin ID     | Admin Panel | admin@gmail.com     |
| Admin PW     | Admin Panel | CFactory-pasW0rD!   |
| USER-2 ID    | User        | test@gmail.com      |
| USER-2 PW    | User        | CFactory-pasW0rD!   |

references: [Stripe Testing](https://stripe.com/docs/testing)
