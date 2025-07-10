
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, FileText, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const stats = [
    { title: 'Total Users', value: '2,847', icon: Users, color: 'text-blue-600' },
    { title: 'Active Tests', value: '45', icon: FileText, color: 'text-green-600' },
    { title: 'Tests Completed', value: '8,567', icon: BookOpen, color: 'text-purple-600' },
    { title: 'Average Score', value: '78%', icon: TrendingUp, color: 'text-orange-600' },
  ];

  const monthlyData = [
    { month: 'Jan', tests: 120, users: 200 },
    { month: 'Feb', tests: 150, users: 180 },
    { month: 'Mar', tests: 180, users: 250 },
    { month: 'Apr', tests: 200, users: 300 },
    { month: 'May', tests: 240, users: 350 },
    { month: 'Jun', tests: 280, users: 400 },
  ];

  const subjectData = [
    { name: 'Mathematics', value: 45, color: '#3b82f6' },
    { name: 'English', value: 25, color: '#10b981' },
    { name: 'Science', value: 20, color: '#f59e0b' },
    { name: 'Others', value: 10, color: '#ef4444' },
  ];

  const performanceData = [
    { score: '90-100', count: 120 },
    { score: '80-89', count: 280 },
    { score: '70-79', count: 350 },
    { score: '60-69', count: 200 },
    { score: '50-59', count: 100 },
    { score: 'Below 50', count: 50 },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 max-w-full overflow-hidden">
      <div className="mb-4 lg:mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm lg:text-base text-gray-600">Welcome to Number Nerd Academy Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-lg lg:text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-5 w-5 lg:h-6 lg:w-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Monthly Activity Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base lg:text-lg">Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-3 lg:p-4 pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="tests" fill="#3b82f6" name="Tests Created" />
                <Bar dataKey="users" fill="#10b981" name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Test Distribution by Subject */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base lg:text-lg">Tests by Subject</CardTitle>
          </CardHeader>
          <CardContent className="p-3 lg:p-4 pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  fontSize={8}
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base lg:text-lg">User Growth Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-3 lg:p-4 pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base lg:text-lg">Score Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-3 lg:p-4 pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={performanceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={10} />
                <YAxis dataKey="score" type="category" width={50} fontSize={9} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
