
import React from 'react';
import AdminSidebarContent from './AdminSidebarContent';

const AdminSidebar = () => {
  return (
    <div className="w-64 h-screen fixed left-0 top-0 z-40 hidden md:block">
      <AdminSidebarContent />
    </div>
  );
};

export default AdminSidebar;
