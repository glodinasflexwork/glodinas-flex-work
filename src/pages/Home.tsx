import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Find Your Dream Job or Hire Top Talent
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Glodinas Flex Work connects job seekers with employers. Whether you're looking for your next career move or searching for the perfect candidate, we've got you covered.
            </p>
            <div className="flex justify-center gap-4">
              {!user && (
                <>
                  <Link to="/signup?role=job_seeker" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                    I'm Looking for a Job
                  </Link>
                  <Link to="/signup?role=employer" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
                    I'm Hiring
                  </Link>
                </>
              )}
              {user && user.role === 'job_seeker' && (
                <Link to="/jobs" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                  Browse Jobs
                </Link>
              )}
              {user && user.role === 'employer' && (
                <Link to="/post-job" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                  Post a Job
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* For Job Seekers */}
            <div className="card">
              <h3 className="text-2xl font-bold text-primary mb-4">For Job Seekers</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Create a professional profile and upload your resume</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Browse thousands of job listings with advanced filters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Save jobs and track your applications</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Communicate directly with employers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Get notified about application status updates</span>
                </li>
              </ul>
              {!user && (
                <Link to="/signup?role=job_seeker" className="btn-primary mt-6 inline-block">
                  Get Started as Job Seeker
                </Link>
              )}
            </div>

            {/* For Employers */}
            <div className="card">
              <h3 className="text-2xl font-bold text-primary mb-4">For Employers</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Create your company profile and showcase your brand</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Post unlimited job openings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Browse qualified candidate profiles</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Review applications and manage hiring pipeline</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Connect with candidates through messaging</span>
                </li>
              </ul>
              {!user && (
                <Link to="/signup?role=employer" className="btn-primary mt-6 inline-block">
                  Get Started as Employer
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-gray-600">Active Job Listings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
              <div className="text-gray-600">Registered Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-gray-600">Job Seekers</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of job seekers and employers today</p>
          {!user && (
            <Link to="/signup" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
              Sign Up Now
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

