import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Glodinas Flex Work</h3>
            <p className="text-gray-400 text-sm">
              Connecting talented job seekers with innovative companies. Find your dream job or hire the perfect candidate today.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-gray-400 hover:text-primary transition">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-lg font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/post-job" className="text-gray-400 hover:text-primary transition">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/candidates" className="text-gray-400 hover:text-primary transition">
                  Browse Candidates
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-primary transition">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: info@glodinasflexwork.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Business St, City, Country</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Glodinas Flex Work. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

