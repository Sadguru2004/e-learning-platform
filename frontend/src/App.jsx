import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateCourse from './pages/CreateCourse';
import CourseDetails from './pages/CourseDetails';  
import MyCourses from './pages/MyCourses';
import SearchResults from './pages/SearchResults';
import PaginatedSearchResults from './pages/PaginatedSearchResults';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

// Import these from the files we'll create
// import CourseDetails from './pages/CourseDetails';
// import MyCourses from './pages/MyCourses';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/create-course" element={
            <PrivateRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
              <CreateCourse />
            </PrivateRoute>
          } />
          {/* Add these later */}
         <Route path="/courses/:id" element={<CourseDetails />} />
         <Route path="/my-courses" element={
            <PrivateRoute allowedRoles={['INSTRUCTOR', 'ADMIN']}>
              <MyCourses />
            </PrivateRoute>
          } />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/search" element={<PaginatedSearchResults />} />
          <Route path="/profile" element={
              <PrivateRoute>
                  <Profile />
              </PrivateRoute>
            } />
            <Route path="/admin" element={
           <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </PrivateRoute>
           } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;