import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// User Pages
import Dashboard from './pages/user/Dashboard';
import FindTrips from './pages/user/FindTrips';
import CreateTrip from './pages/user/CreateTrip';
import MyTrips from './pages/user/MyTrips';
import TripDetailsPage from './pages/user/TripDetailsPage';
import Profile from './pages/user/Profile';
import Messages from './pages/user/Messages';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageTrips from './pages/admin/ManageTrips';
import ManageMatches from './pages/admin/ManageMatches';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes without Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes with Navbar and Footer */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    {/* Public */}
                    <Route path="/" element={<Landing />} />

                    {/* Protected User Routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/trips"
                      element={
                        <ProtectedRoute>
                          <FindTrips />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/trips/create"
                      element={
                        <ProtectedRoute requireDriver>
                          <CreateTrip />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/trips/:id"
                      element={
                        <ProtectedRoute>
                          <TripDetailsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/my-trips"
                      element={
                        <ProtectedRoute>
                          <MyTrips />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/messages"
                      element={
                        <ProtectedRoute>
                          <Messages />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requireAdmin>
                          <div className="flex">
                            <Sidebar />
                            <div className="flex-1">
                              <AdminDashboard />
                            </div>
                          </div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <ProtectedRoute requireAdmin>
                          <div className="flex">
                            <Sidebar />
                            <div className="flex-1">
                              <ManageUsers />
                            </div>
                          </div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/trips"
                      element={
                        <ProtectedRoute requireAdmin>
                          <div className="flex">
                            <Sidebar />
                            <div className="flex-1">
                              <ManageTrips />
                            </div>
                          </div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/matches"
                      element={
                        <ProtectedRoute requireAdmin>
                          <div className="flex">
                            <Sidebar />
                            <div className="flex-1">
                              <ManageMatches />
                            </div>
                          </div>
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
