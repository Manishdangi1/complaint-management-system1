'use client';

import { useState, useEffect } from 'react';
import { User, Complaint, ComplaintStatus } from '@/types';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import ComplaintForm from '@/components/ComplaintForm';
import ComplaintTable from '@/components/ComplaintTable';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
        if (JSON.parse(userData).role === 'admin') {
          fetchComplaints();
        } else {
          fetchUserComplaints();
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setUser(data.data.user);
        setIsAuthenticated(true);
        
        if (data.data.user.role === 'admin') {
          fetchComplaints();
        } else {
          fetchUserComplaints();
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setUser(data.data.user);
        setIsAuthenticated(true);
        fetchUserComplaints();
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setComplaints([]);
    setError('');
  };

  const fetchComplaints = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/complaints', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setComplaints(data.data);
      }
    } catch {
      console.error('Error fetching complaints');
    }
  };

  const fetchUserComplaints = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/users/complaints', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setComplaints(data.data);
      }
    } catch {
      console.error('Error fetching user complaints');
    }
  };

  const handleComplaintSubmit = async (complaintData: {
    title: string;
    description: string;
    category: string;
    priority: string;
  }) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(complaintData),
      });

      const data = await response.json();
      if (data.success) {
        fetchUserComplaints();
        alert('Complaint submitted successfully!');
      } else {
        alert(data.error || 'Failed to submit complaint');
      }
    } catch {
      alert('An error occurred while submitting the complaint');
    }
  };

  const handleStatusUpdate = async (id: string, status: ComplaintStatus) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/complaints/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (data.success) {
        fetchComplaints();
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch {
      alert('An error occurred while updating the status');
    }
  };

  const handleDeleteComplaint = async (id: string) => {
    if (!confirm('Are you sure you want to delete this complaint?')) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/complaints/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        fetchComplaints();
      } else {
        alert(data.error || 'Failed to delete complaint');
      }
    } catch {
      alert('An error occurred while deleting the complaint');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Complaint Management System</h1>
            <p className="text-gray-600">Manage and track complaints efficiently</p>
          </div>

          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setShowLogin(true)}
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  showLogin
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setShowLogin(false)}
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  !showLogin
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {showLogin ? (
            <LoginForm onLogin={handleLogin} isLoading={isLoading} error={error} />
          ) : (
            <RegisterForm onRegister={handleRegister} isLoading={isLoading} error={error} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complaint Management System</h1>
              <p className="text-sm text-gray-600">
                Welcome, {user?.name} ({user?.role})
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user?.role === 'admin' ? (
          // Admin Dashboard
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Dashboard</h2>
              <ComplaintTable
                complaints={complaints}
                onStatusUpdate={handleStatusUpdate}
                onDelete={handleDeleteComplaint}
                isLoading={isLoading}
              />
            </div>
          </div>
        ) : (
          // User Dashboard
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit a New Complaint</h2>
              <ComplaintForm onSubmit={handleComplaintSubmit} isLoading={isLoading} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">My Complaints</h2>
              {complaints.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No complaints submitted yet.</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Priority
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date Submitted
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {complaints.map((complaint) => (
                          <tr key={complaint._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{complaint.title}</div>
                              <div className="text-sm text-gray-500">{complaint.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {complaint.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                complaint.priority === 'High' ? 'bg-red-100 text-red-800' :
                                complaint.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {complaint.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                complaint.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {complaint.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(complaint.dateSubmitted).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
