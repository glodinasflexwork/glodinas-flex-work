import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary">
              Glodinas Flex Work
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Public Links (Always visible) */}
            <Link to="/" className="text-gray-700 hover:text-primary transition">
              Home
            </Link>
            <Link to="/jobs" className="text-gray-700 hover:text-primary transition">
              Browse Jobs
            </Link>

            {/* Not Logged In */}
            {!user && (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary transition">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}

            {/* Job Seeker Links */}
            {user && user.role === 'job_seeker' && (
              <>
                <Link to="/applications" className="text-gray-700 hover:text-primary transition">
                  My Applications
                </Link>
                <Link to="/saved-jobs" className="text-gray-700 hover:text-primary transition">
                  Saved Jobs
                </Link>
                <Link to="/messages" className="text-gray-700 hover:text-primary transition">
                  Messages
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-primary transition">
                  Profile
                </Link>
                <button onClick={handleLogout} className="btn-secondary">
                  Logout
                </button>
              </>
            )}

            {/* Employer Links */}
            {user && user.role === 'employer' && (
              <>
                <Link to="/post-job" className="text-gray-700 hover:text-primary transition">
                  Post Job
                </Link>
                <Link to="/my-jobs" className="text-gray-700 hover:text-primary transition">
                  My Jobs
                </Link>
                <Link to="/candidates" className="text-gray-700 hover:text-primary transition">
                  Candidates
                </Link>
                <Link to="/employer-applications" className="text-gray-700 hover:text-primary transition">
                  Applications
                </Link>
                <Link to="/messages" className="text-gray-700 hover:text-primary transition">
                  Messages
                </Link>
                <Link to="/company" className="text-gray-700 hover:text-primary transition">
                  Company
                </Link>
                <button onClick={handleLogout} className="btn-secondary">
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-primary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

