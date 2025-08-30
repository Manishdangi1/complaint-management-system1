'use client';

import { useState, useEffect } from 'react';
import { Complaint, ComplaintStatus, ComplaintPriority } from '@/types';

interface ComplaintTableProps {
  complaints: Complaint[];
  onStatusUpdate: (id: string, status: ComplaintStatus) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function ComplaintTable({ 
  complaints, 
  onStatusUpdate, 
  onDelete, 
  isLoading = false 
}: ComplaintTableProps) {
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>(complaints);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
  });

  useEffect(() => {
    let filtered = [...complaints];

    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters.priority) {
      filtered = filtered.filter(c => c.priority === filters.priority);
    }
    if (filters.category) {
      filtered = filtered.filter(c => c.category === filters.category);
    }

    setFilteredComplaints(filtered);
  }, [complaints, filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', priority: '', category: '' });
  };

  const getPriorityColor = (priority: ComplaintPriority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Filters */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Filter Complaints</h3>
        </div>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
           <div>
             <label htmlFor="status-filter" className="block text-base font-bold text-gray-800 mb-2">Status</label>
             <select
               id="status-filter"
               value={filters.status}
               onChange={(e) => handleFilterChange('status', e.target.value)}
               className="w-full px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white shadow-sm font-semibold"
             >
               <option value="" className="font-semibold">All Statuses</option>
               <option value="Pending" className="font-semibold">Pending</option>
               <option value="In Progress" className="font-semibold">In Progress</option>
               <option value="Resolved" className="font-semibold">Resolved</option>
             </select>
           </div>

           <div>
             <label htmlFor="priority-filter" className="block text-base font-bold text-gray-800 mb-2">Priority</label>
             <select
               id="priority-filter"
               value={filters.priority}
               onChange={(e) => handleFilterChange('priority', e.target.value)}
               className="w-full px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white shadow-sm font-semibold"
             >
               <option value="" className="font-semibold">All Priorities</option>
               <option value="Low" className="font-semibold">Low</option>
               <option value="Medium" className="font-semibold">Medium</option>
               <option value="High" className="font-semibold">High</option>
             </select>
           </div>

           <div>
             <label htmlFor="category-filter" className="block text-base font-bold text-gray-800 mb-2">Category</label>
             <select
               id="category-filter"
               value={filters.category}
               onChange={(e) => handleFilterChange('category', e.target.value)}
               className="w-full px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white shadow-sm font-semibold"
             >
               <option value="" className="font-semibold">All Categories</option>
               <option value="Product" className="font-semibold">Product</option>
               <option value="Service" className="font-semibold">Service</option>
               <option value="Support" className="font-semibold">Support</option>
               <option value="Technical" className="font-semibold">Technical</option>
               <option value="Other" className="font-semibold">Other</option>
             </select>
           </div>

          <div className="flex gap-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
        
        {/* Active Filters Display */}
        {(filters.status || filters.priority || filters.category) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Active Filters:</span>
              {filters.status && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Status: {filters.status}
                  <button
                    onClick={() => handleFilterChange('status', '')}
                    className="ml-1.5 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.priority && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Priority: {filters.priority}
                  <button
                    onClick={() => handleFilterChange('priority', '')}
                    className="ml-1.5 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.category && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Category: {filters.category}
                  <button
                    onClick={() => handleFilterChange('category', '')}
                    className="ml-1.5 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No complaints found
                </td>
              </tr>
            ) : (
              filteredComplaints.map((complaint) => (
                <tr key={complaint._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={complaint.title}>
                      {complaint.title}
                    </div>
                    <div className="text-sm text-gray-500 max-w-xs truncate" title={complaint.description}>
                      {complaint.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {complaint.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      aria-label={`Update status for complaint: ${complaint.title}`}
                      value={complaint.status}
                      onChange={(e) => onStatusUpdate(complaint._id!, e.target.value as ComplaintStatus)}
                      className={`px-2 py-1 text-xs font-semibold rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(complaint.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(complaint.dateSubmitted).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onDelete(complaint._id!)}
                      className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Showing {filteredComplaints.length} of {complaints.length} complaints
        </p>
      </div>
    </div>
  );
}
