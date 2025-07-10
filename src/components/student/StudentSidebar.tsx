
import React from 'react';
import StudentSidebarContent from './StudentSidebarContent';

const StudentSidebar = () => {
  return (
    <div className="w-64 h-screen fixed left-0 top-0 z-40 hidden md:block">
      <StudentSidebarContent />
    </div>
  );
};

export default StudentSidebar;
