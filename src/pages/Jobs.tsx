import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Job } from '../types';

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [isRemote, setIsRemote] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (location) params.append('location', location);
      if (employmentType) params.append('employmentType', employmentType);
      if (experienceLevel) params.append('experienceLevel', experienceLevel);
      if (isRemote) params.append('isRemote', 'true');

      const response = await api.get(`/jobs?${params.toString()}`);
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Browse Jobs</h1>

        {/* Filters */}
        <div className="card mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Job title, company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="City, country..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type
                </label>
                <select
                  className="input-field"
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level
                </label>
                <select
                  className="input-field"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <option value="">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isRemote}
                    onChange={(e) => setIsRemote(e.target.checked)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">Remote Only</span>
                </label>
              </div>
              <div className="flex items-end">
                <button type="submit" className="btn-primary w-full">
                  Search Jobs
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading jobs...</div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600">No jobs found. Try adjusting your filters.</div>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="card hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                    <div className="text-gray-600 mb-2">{job.company?.name}</div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.location && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          📍 {job.location}
                        </span>
                      )}
                      {job.employmentType && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {job.employmentType}
                        </span>
                      )}
                      {job.experienceLevel && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {job.experienceLevel}
                        </span>
                      )}
                      {job.isRemote && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                          🌍 Remote
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 line-clamp-2">{job.description}</p>
                    {(job.salaryMin || job.salaryMax) && (
                      <div className="mt-3 text-primary font-semibold">
                        {job.salaryCurrency} {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()}
                      </div>
                    )}
                  </div>
                  {job.company?.logoUrl && (
                    <img
                      src={job.company.logoUrl}
                      alt={job.company.name}
                      className="w-16 h-16 object-contain ml-4"
                    />
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;

