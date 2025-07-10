
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Eye, Edit, UserPlus } from 'lucide-react';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', plan: 'Premium', status: 'Active', testsCompleted: 15, joinDate: '2024-01-15' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', plan: 'Standard', status: 'Active', testsCompleted: 8, joinDate: '2024-02-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', plan: 'Basic', status: 'Inactive', testsCompleted: 3, joinDate: '2024-03-10' },
    { id: 4, name: 'Emma Wilson', email: 'emma@example.com', plan: 'Free', status: 'Active', testsCompleted: 2, joinDate: '2024-03-25' },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 min-h-screen">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Users Management</h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">Manage user accounts and subscriptions</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto flex-shrink-0">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="w-full">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
              <Button variant="outline" className="w-full sm:w-auto flex-shrink-0">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="w-full">
          <CardHeader className="p-3 sm:p-4 md:p-6 pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg md:text-xl">All Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              <div className="space-y-3 p-3">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">{user.name}</h3>
                        <p className="text-xs text-gray-600 break-all">{user.email}</p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button variant="ghost" size="sm" className="p-1 h-7 w-7">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-1 h-7 w-7">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.plan === 'Premium' ? 'bg-purple-100 text-purple-800' :
                        user.plan === 'Standard' ? 'bg-blue-100 text-blue-800' :
                        user.plan === 'Basic' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.plan}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Tests: {user.testsCompleted}</span>
                      <span>Joined: {user.joinDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px] px-3 sm:px-4 py-3 text-xs sm:text-sm">Name</TableHead>
                      <TableHead className="min-w-[180px] px-3 sm:px-4 py-3 text-xs sm:text-sm">Email</TableHead>
                      <TableHead className="min-w-[80px] px-3 sm:px-4 py-3 text-xs sm:text-sm">Plan</TableHead>
                      <TableHead className="min-w-[80px] px-3 sm:px-4 py-3 text-xs sm:text-sm">Status</TableHead>
                      <TableHead className="min-w-[100px] hidden md:table-cell px-3 sm:px-4 py-3 text-xs sm:text-sm">Tests</TableHead>
                      <TableHead className="min-w-[100px] hidden lg:table-cell px-3 sm:px-4 py-3 text-xs sm:text-sm">Join Date</TableHead>
                      <TableHead className="min-w-[100px] px-3 sm:px-4 py-3 text-xs sm:text-sm">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium px-3 sm:px-4 py-3 text-xs sm:text-sm">{user.name}</TableCell>
                        <TableCell className="px-3 sm:px-4 py-3 text-xs sm:text-sm max-w-[200px] truncate">{user.email}</TableCell>
                        <TableCell className="px-3 sm:px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.plan === 'Premium' ? 'bg-purple-100 text-purple-800' :
                            user.plan === 'Standard' ? 'bg-blue-100 text-blue-800' :
                            user.plan === 'Basic' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.plan}
                          </span>
                        </TableCell>
                        <TableCell className="px-3 sm:px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell px-3 sm:px-4 py-3 text-xs sm:text-sm">{user.testsCompleted}</TableCell>
                        <TableCell className="hidden lg:table-cell px-3 sm:px-4 py-3 text-xs sm:text-sm">{user.joinDate}</TableCell>
                        <TableCell className="px-3 sm:px-4 py-3">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="p-1 h-7 w-7 sm:h-8 sm:w-8">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="p-1 h-7 w-7 sm:h-8 sm:w-8">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Users;
