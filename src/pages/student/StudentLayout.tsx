
import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from '@/components/student/StudentSidebar';
import StudentMobileSidebar from '@/components/student/StudentMobileSidebar';
import StudentFooter from '@/components/student/StudentFooter';

const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        <StudentSidebar />
        <div className="flex-1 md:ml-64 flex flex-col">
          {/* Mobile Header */}
          <div className="md:hidden bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">S</span>
              </div>
              <h1 className="font-bold text-sm sm:text-lg text-gray-900">Student Portal</h1>
            </div>
            <StudentMobileSidebar />
          </div>
          
          <main className="flex-1 min-h-0">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 max-w-7xl py-4 lg:py-6">
              <Outlet />
            </div>
          </main>
          
          <StudentFooter />
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
