
import React from 'react';
import AdminProfile from '@/components/admin/AdminProfile';

const AdminProfilePage = () => {
  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Administrator Profile</h1>
        <p className="text-gray-600 mt-1">Manage your administrator account and system preferences</p>
      </div>
      <AdminProfile />
    </div>
  );
};

export default AdminProfilePage;
