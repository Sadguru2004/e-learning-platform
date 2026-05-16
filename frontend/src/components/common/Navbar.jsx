import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { BookOpen, LogOut, User, GraduationCap, Menu, X ,Search ,UserCircle} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  // Don't show navbar on login/register pages? (optional)
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';
  if (hideNavbar) return null;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-800 hidden sm:inline">E-Learning</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          {/* Search Bar - Desktop */}
<div className="hidden md:block flex-1 max-w-md mx-4">
  <div className="relative">
    <input
      type="text"
      placeholder="Search courses..."
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          navigate(`/search?q=${e.target.value}`);
          e.target.value = '';
        }
      }}
    />
    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
  </div>
</div>
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                  Dashboard
                </Link>
                {user?.role === 'ADMIN' && (
                <Link to="/admin" className="text-gray-700 hover:text-purple-600 transition">
                Admin Panel
                </Link>
                )}
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition">
                    Profile
                </Link>
                {user.role === 'INSTRUCTOR' && (
                  <Link to="/my-courses" className="text-gray-700 hover:text-blue-600 transition">
                    My Courses
                  </Link>
                )}
                <div className="border-l pl-4 flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {user.role === 'INSTRUCTOR' ? (
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                    ) : (
                      <User className="h-5 w-5 text-blue-600" />
                    )}
                    <span className="text-sm text-gray-600">
                      {user.email}
                    </span>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 px-2">
                  {user.role === 'INSTRUCTOR' ? (
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                  ) : (
                    <User className="h-5 w-5 text-blue-600" />
                  )}
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                    {user.role}
                  </span>
                </div>
                <Link 
                  to="/dashboard" 
                  className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {user?.role === 'ADMIN' && (
                <Link 
                to="/admin" 
                className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setIsMenuOpen(false)}
                >
                Admin Panel
              </Link>
                )}
                <Link 
                  to="/profile" 
                  className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                {user.role === 'INSTRUCTOR' && (
                  <Link 
                    to="/my-courses" 
                    className="block px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Courses
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-2 py-2 text-red-600 hover:bg-gray-100 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block px-2 py-2 text-blue-600 hover:bg-gray-100 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;