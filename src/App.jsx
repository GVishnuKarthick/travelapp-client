import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CreateItinerary from './pages/CreateItinerary';
import ItineraryDetails from './pages/ItineraryDetails';
import CalendarView from './pages/CalendarView';
import MemoriesPage from './pages/MemoriesPage';
import ProfilePage from './pages/ProfilePage';
import Dashboard from './pages/Dashboard';
import EditItinerary from './pages/EditItinerary';
import PublicItinerary from './pages/PublicItinerary';
import { AppProvider, AppContext } from './context/AppContext'; // Fixed space in import

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = React.useContext(AppContext);
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <CreateItinerary />
              </PrivateRoute>
            }
          />
          <Route
            path="/itinerary/:id"
            element={
              <PrivateRoute>
                <ItineraryDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <CalendarView />
              </PrivateRoute>
            }
          />
          <Route
            path="/memories"
            element={
              <PrivateRoute>
                <MemoriesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route path="/edit-itinerary/:id" element={<EditItinerary />} />
      <Route path="/itinerary/:id" element={<PublicItinerary />} />

        </Routes>
      </Router>
    </AppProvider>
  );
}