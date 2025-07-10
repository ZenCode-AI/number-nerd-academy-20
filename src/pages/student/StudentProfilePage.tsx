
import React from 'react';
import StudentProfile from '@/components/student/StudentProfile';

const StudentProfilePage = () => {
  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Student Profile</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>
      <StudentProfile />
    </div>
  );
};

export default StudentProfilePage;
