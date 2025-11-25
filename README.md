# ⚽ SupporterCarpool - Football Supporter Carpooling Application

A full-stack carpooling application designed specifically for football supporters to share rides to matches, save money, and reduce carbon emissions while connecting with fellow fans.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## ✨ Features

### For Supporters
- **Find Trips**: Search and filter trips by match, location, and departure time
- **Create Trips**: Offer rides to fellow supporters heading to the same match
- **Smart Matching**: Algorithm matches you with compatible travelers based on team, location, and interests
- **Request System**: Request to join trips with driver approval
- **Profile Management**: Manage your preferences, interests, and supporter details
- **Multi-step Trip Creation**: Intuitive form for creating trips with match selection, vehicle info, and preferences

### For Administrators
- **User Management**: View, ban/unban, and promote users to admin
- **Trip Management**: Monitor all trips, filter by status, and manage bookings
- **Match Management**: Create and manage football matches
- **Statistics Dashboard**: View platform metrics and analytics

### Technical Features
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Separate access for users and admins
- **Responsive Design**: Mobile-first UI that works on all devices
- **Type Safety**: Full TypeScript implementation on both frontend and backend
- **Smart Grouping**: Recommendation algorithm for compatible trip groupings
- **RESTful API**: Well-structured backend with proper MVC architecture

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator & Zod
- **CORS**: cors middleware
- **Environment**: dotenv

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Icons**: React Icons (Feather Icons)
- **Date Formatting**: date-fns

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── models/          # Mongoose models (User, Trip, Match, Message)
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic layer
│   │   ├── routes/          # API route definitions
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── utils/           # JWT, scoring algorithm
│   │   ├── types/           # TypeScript type definitions
│   │   ├── scripts/         # Seed data script
│   │   └── server.ts        # Express app entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable React components
    │   │   ├── layout/      # Navbar, Footer, Sidebar
    │   │   ├── auth/        # Login, Register forms
    │   │   ├── common/      # Button, Input, Card, Modal
    │   │   ├── trips/       # Trip-related components
    │   │   ├── matches/     # Match-related components
    │   │   └── admin/       # Admin tables and stats
    │   ├── pages/           # Page components
    │   │   ├── public/      # Landing, Login, Register
    │   │   ├── user/        # Dashboard, Trips, Profile
    │   │   └── admin/       # Admin management pages
    │   ├── context/         # React Context (Auth)
    │   ├── services/        # API service functions
    │   ├── types/           # TypeScript interfaces
    │   ├── utils/           # Helper functions
    │   ├── App.tsx          # Root component with routing
    │   ├── main.tsx         # React entry point
    │   └── index.css        # Global styles + Tailwind
    ├── package.json
    ├── vite.config.ts
    └── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB** v6 or higher (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/raynlamlaika/coco.git
   cd coco
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the following:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/supporter-carpool
   JWT_SECRET=your_secure_random_secret_key_here
   JWT_EXPIRE=24h
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. **Set up the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

#### Development Mode

1. **Start MongoDB** (if running locally)
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community

   # On Ubuntu/Debian
   sudo systemctl start mongod

   # On Windows
   net start MongoDB
   ```

2. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

3. **Start the Frontend Dev Server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

4. **(Optional) Seed the Database**
   ```bash
   cd backend
   npm run seed
   ```
   This creates sample users, matches, and trips for testing.

#### Production Mode

1. **Build the Backend**
   ```bash
   cd backend
   npm run build
   ```

2. **Build the Frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Start the Backend**
   ```bash
   cd backend
   npm start
   ```

4. **Serve the Frontend**
   - The built frontend can be served using any static file server
   - Or configure your backend to serve the `frontend/dist` folder

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (protected)
- `DELETE /api/users/:id` - Delete user (admin)

### Trips
- `GET /api/trips` - Get all trips (with filters)
- `POST /api/trips` - Create new trip (driver only)
- `GET /api/trips/:id` - Get trip by ID
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip
- `POST /api/trips/:id/request` - Request to join trip
- `POST /api/trips/:id/confirm/:userId` - Confirm passenger request
- `POST /api/trips/:id/reject/:userId` - Reject passenger request
- `GET /api/trips/:id/recommendations` - Get trip recommendations
- `POST /api/trips/group` - Group compatible trips

### Matches
- `GET /api/matches` - Get all matches
- `POST /api/matches` - Create match (admin)
- `GET /api/matches/upcoming` - Get upcoming matches
- `PUT /api/matches/:id` - Update match (admin)
- `DELETE /api/matches/:id` - Delete match (admin)

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/:tripId` - Get trip messages

## 🧪 Demo Accounts

After running the seed script (`npm run seed`), you can use these accounts:

### Admin Account
- **Email**: admin1@example.com
- **Password**: admin123

### User Accounts
- **Email**: user1@example.com
- **Password**: user123
- **Email**: user2@example.com
- **Password**: user123

*(More accounts are available - check the seed script output)*

## 🎨 Design System

The application uses a consistent design system with TailwindCSS:

- **Primary Color**: Blue (#3B82F6)
- **Secondary Color**: Green (#10B981)
- **Accent Color**: Orange (#F59E0B)
- **Background**: Gray-50
- **Text**: Gray-900

Components follow a mobile-first responsive design with:
- Rounded corners (`rounded-lg`, `rounded-xl`)
- Consistent shadows (`shadow-md`, `shadow-lg`)
- Smooth transitions and hover effects
- Gradient backgrounds for hero sections
- Card-based layouts

## 🔐 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure, httpOnly tokens with expiration
- **Input Validation**: Server-side validation on all endpoints
- **CORS Configuration**: Restricted to allowed origins
- **Protected Routes**: Authentication and authorization middleware
- **Role-based Access**: Admin and user role separation
- **Environment Variables**: Sensitive data in .env files

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Rayn Lamlaika**
- GitHub: [@raynlamlaika](https://github.com/raynlamlaika)

## 🙏 Acknowledgments

- Football supporters community for inspiration
- Open source community for amazing tools
- All contributors who help improve this project

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [support@supportercarpool.com](mailto:support@supportercarpool.com)

---

**Made with ⚽ and ❤️ for football supporters everywhere**