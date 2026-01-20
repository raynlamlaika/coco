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










#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <map>
#include <queue>
using namespace std;

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

int size;
int units_per_player;

typedef struct axes
{   
    int x;
    int y;
} axes ; 


typedef struct legal
{
    string atype;
    int    index;
    string dir1;
    string dir2;
} legal;


vector<vector<int>> convertMap(const vector<string>& map)
{
    int size = map.size();
    vector<vector<int>> grid(size, vector<int>(size, -1)); // initialize with -1

    for (int y = 0; y < size; y++)
    {
        for (int x = 0; x < size; x++)
        {
            if (map[y][x] == '.')
                grid[y][x] = -1; // hole / unplayable
            else
                grid[y][x] = map[y][x] - '0'; // convert char to int
        }
    }

    return grid;
}

// Move a unit in a given direction and return the new position
axes sumMove(const axes& unitPos, const string& dir)
{
    axes newPos = unitPos;

    if (dir == "N")  { newPos.y -= 1; }
    else if (dir == "NE"){ newPos.y -= 1; newPos.x += 1; }
    else if (dir == "E") { newPos.x += 1; }
    else if (dir == "SE"){ newPos.y += 1; newPos.x += 1; }
    else if (dir == "S") { newPos.y += 1; }
    else if (dir == "SW"){ newPos.y += 1; newPos.x -= 1; }
    else if (dir == "W") { newPos.x -= 1; }
    else if (dir == "NW"){ newPos.y -= 1; newPos.x -= 1; }

    return newPos;
}

void sumBuild(vector<vector<int>>& map, const axes& unitPos, const string& dir)
{
    int x = unitPos.x;
    int y = unitPos.y;

    if (dir == "N")  y--;
    else if (dir == "NE"){ y--; x++; }
    else if (dir == "E")  x++;
    else if (dir == "SE"){ y++; x++; }
    else if (dir == "S")  y++;
    else if (dir == "SW"){ y++; x--; }
    else if (dir == "W")  x--;
    else if (dir == "NW"){ y--; x--; }

    if (y < 0 || x < 0 || y >= map.size() || x >= map.size())
        return;

    if (map[y][x] == -1 || map[y][x] >= 4)
        return;

    map[y][x]++;  // 4 = dome
}


int floodFill(axes &start, vector<vector<int>>& map)
{
        int size = map.size();
    bool visited[7][7] = {false}; // max size is 7

    // If start position itself is invalid
    if (start.x < 0 || start.y < 0 ||
        start.x >= size || start.y >= size ||
        map[start.x][start.y] == -1 ||
        map[start.x][start.y] >= 4)
        return 0;

    queue<axes> q;
    q.push(start);
    visited[start.x][start.y] = true;

    int reachable = 0;

    // 8 directions (including diagonals)
    int dx[8] = {-1,-1,-1, 0,0, 1,1,1};
    int dy[8] = {-1, 0, 1,-1,1,-1,0,1};

    while (!q.empty())
    {
        axes curr = q.front();
        q.pop();
        reachable++;

        // Optional performance cap
        if (reachable >= 20)
            break;

        for (int i = 0; i < 8; i++)
        {
            int nx = curr.x + dx[i];
            int ny = curr.y + dy[i];

            if (nx < 0 || ny < 0 || nx >= size || ny >= size)
                continue;

            if (visited[nx][ny])
                continue;

            if (map[nx][ny] == -1) // hole
                continue;

            if (map[nx][ny] >= 4) // dome
                continue;

            // Movement rule: can only climb +1
            if (map[nx][ny] - map[curr.x][curr.y] > 1)
                continue;

            visited[nx][ny] = true;
            q.push({nx, ny});
        }
    }

    return reachable;
}

int eval(axes& myPos, axes& enemyPos,vector<vector<int>>& map)
{
    int size = map.size();

    if (myPos.x < 0 || myPos.y < 0 || myPos.x >= size || myPos.y >= size)
        return -1000000;

    int score = 0;
    int h = map[myPos.y][myPos.x];

    if (h == 3)
        score += 10000;
    else
        score += h * 20;

    score += floodFill(myPos, map);

    if (enemyPos.x != -1)
        score -= floodFill(enemyPos, map);

    return score;
}

// string Solve(vector<axes> Munites, vector<axes> Ounites, vector<string> map,vector<legal>legalMoves)
// {

//     // chage the map int vec of ints
//     vector<vector<int>> simGrid = convertMap(map);
//     vector<int> MovesEval;
//     for (legal move : legalMoves)
//     {
//         vector<vector<int>> tempMap = simGrid;
//         axes newPos = sumMove(Munites[move.index], move.dir1); // simulate move
//         sumBuild(tempMap, newPos, move.dir2);   

//         // eval the move score
//         int score = eval(newPos, Ounites[0], tempMap);

//         // Store score for this move
//         MovesEval.push_back(score);
//     }
    
//     // = bestScoor(MovesEval, );

//     return choosedMove;
// }

string Solve(vector<axes> Munites, vector<axes> Ounites, vector<string> map, vector<legal> legalMoves)
{
    vector<vector<int>> simGrid = convertMap(map);
    int bestScore = -1000000000;
    string bestMove = legalMoves[0].atype + " 0 " +
                      legalMoves[0].dir1 + " " + legalMoves[0].dir2;

    for (const legal& move : legalMoves)
    {
        vector<vector<int>> tempMap = simGrid;

        axes newPos = sumMove(Munites[move.index], move.dir1);
        sumBuild(tempMap, newPos, move.dir2);

        int score = eval(newPos, Ounites[0], tempMap);

        if (score > bestScore)
        {
            bestScore = score;
            bestMove = move.atype + " " + to_string(move.index)
                       + " " + move.dir1 + " " + move.dir2;
        }
    }
    return bestMove;
}



int main()
{
    
    cin >> ::size; cin.ignore();
    
    cin >> ::units_per_player; cin.ignore();
    

    // game loop
    while (1)
    {
        vector<axes> Munites;
        vector<axes> Ounites;
        vector<string> map;
        vector<legal>legalMoves;

        for (int i = 0; i < ::size; i++)
        {
            string row;
            cin >> row; cin.ignore();
            map.push_back(row);
        }
        for (int i = 0; i < ::units_per_player; i++)
        {
            // the maps that player controls
            int unit_x; // x axes of mine
            int unit_y; // y axes of mine
            cin >> unit_x >> unit_y; cin.ignore();
            
            axes holder;
            holder.x = unit_x;
            holder.y = unit_y;
            Munites.push_back(holder);


        }
        for (int i = 0; i < ::units_per_player; i++)
        {
            int other_x; // x axes opponent's control
            int other_y; // y axes opponent's control // if it not visible
            // -1 , -1
            cin >> other_x >> other_y; cin.ignore();
            axes holder;
            holder.x = other_x;
            holder.y = other_y;
            Ounites.push_back(holder);
        }

        int legal_actions;
        
        cin >> legal_actions; cin.ignore();
        for (int i = 0; i < legal_actions; i++)
        {
            string atype;
            int    index;
            string dir1;
            string dir2;
            cin >> atype >> index >> dir1 >> dir2; cin.ignore();
            legal helper;

            helper.atype = atype ;  
            helper.index = index ;  
            helper.dir1  = dir1  ; 
            helper.dir2  = dir2  ;
            legalMoves.push_back(helper);
        }
        
        
        string chosenAction = Solve(Munites, Ounites , map, legalMoves);
        // Write an action using cout. DON'T FORGET THE "<< endl"
        // To debug: cerr << "Debug messages..." << endl;

        cout << chosenAction << endl;
    }
}
