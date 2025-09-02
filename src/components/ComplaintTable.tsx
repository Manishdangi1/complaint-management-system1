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
         <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
       {/* Filters */}
       <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
         <div className="mb-6">
           <h3 className="text-xl font-bold text-gray-900 mb-2">Filter Complaints</h3>
           <p className="text-gray-600">Refine your search to find specific complaints</p>
         </div>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
           <div>
             <label htmlFor="status-filter" className="block text-base font-bold text-gray-800 mb-2">Status</label>
                            <select
                 id="status-filter"
                 value={filters.status}
                 onChange={(e) => handleFilterChange('status', e.target.value)}
                 className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-gray-900 bg-white shadow-md font-semibold transition-all duration-200 hover:border-gray-400"
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
                 className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-gray-900 bg-white shadow-md font-semibold transition-all duration-200 hover:border-gray-400"
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
                 className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-gray-900 bg-white shadow-md font-semibold transition-all duration-200 hover:border-gray-400"
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
               className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 shadow-sm transition-all duration-200"
             >
               Clear Filters
             </button>
          </div>
        </div>
        
                 {/* Active Filters Display */}
         {(filters.status || filters.priority || filters.category) && (
           <div className="mt-6 pt-6 border-t border-gray-200">
             <div className="flex items-center gap-3 flex-wrap">
               <span className="text-sm font-semibold text-gray-700">Active Filters:</span>
               {filters.status && (
                 <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-200 shadow-sm">
                   Status: {filters.status}
                   <button
                     onClick={() => handleFilterChange('status', '')}
                     className="ml-2 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                   >
                     ×
                   </button>
                 </span>
               )}
               {filters.priority && (
                 <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200 shadow-sm">
                   Priority: {filters.priority}
                   <button
                     onClick={() => handleFilterChange('priority', '')}
                     className="ml-2 text-green-600 hover:text-green-800 hover:bg-green-200 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                   >
                     ×
                   </button>
                 </span>
               )}
               {filters.category && (
                 <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 border border-purple-200 shadow-sm">
                   Category: {filters.category}
                   <button
                     onClick={() => handleFilterChange('category', '')}
                     className="ml-2 text-purple-600 hover:text-purple-800 hover:bg-purple-200 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
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
           <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
             <tr>
               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                 Title
               </th>
               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                 Category
               </th>
               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                 Priority
               </th>
               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                 Status
               </th>
               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                 Date Submitted
               </th>
               <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
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
                 <tr key={complaint._id} className="hover:bg-blue-50 transition-colors duration-200 border-l-4 border-l-transparent hover:border-l-blue-500">
                   <td className="px-6 py-5 whitespace-nowrap">
                     <div className="text-sm font-semibold text-gray-900 max-w-xs truncate" title={complaint.title}>
                       {complaint.title}
                     </div>
                     <div className="text-sm text-gray-600 max-w-xs truncate mt-1" title={complaint.description}>
                       {complaint.description}
                     </div>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {complaint.category}
                  </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`inline-flex px-3 py-2 text-xs font-bold rounded-full shadow-sm ${getPriorityColor(complaint.priority)}`}>
                       {complaint.priority}
                     </span>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <select
                       aria-label={`Update status for complaint: ${complaint.title}`}
                       value={complaint.status}
                       onChange={(e) => onStatusUpdate(complaint._id!, e.target.value as ComplaintStatus)}
                       className={`px-3 py-2 text-xs font-bold rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200 ${getStatusColor(complaint.status)}`}
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
                       className="text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 border border-red-200 hover:border-red-300 transition-all duration-200 font-medium"
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
       <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
         <div className="flex items-center justify-between">
           <p className="text-sm font-medium text-gray-700">
             Showing <span className="font-bold text-blue-600">{filteredComplaints.length}</span> of <span className="font-bold text-gray-900">{complaints.length}</span> complaints
           </p>
           {filteredComplaints.length > 0 && (
             <div className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
               {Math.round((filteredComplaints.length / complaints.length) * 100)}% of total
             </div>
           )}
         </div>
       </div>
    </div>
  );
}
