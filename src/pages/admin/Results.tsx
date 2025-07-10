
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Download, Eye, TrendingUp, Award, Users } from 'lucide-react';

const Results = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const results = [
    { id: 1, student: 'John Doe', test: 'SAT Math Practice Test 1', score: 85, maxScore: 100, percentage: 85, time: 75, status: 'Completed', date: '2024-03-15' },
    { id: 2, student: 'Sarah Smith', test: 'GCSE Mathematics Foundation', score: 92, maxScore: 100, percentage: 92, time: 88, status: 'Completed', date: '2024-03-14' },
    { id: 3, student: 'Mike Johnson', test: 'A-Level Advanced Mathematics', score: 76, maxScore: 100, percentage: 76, time: 115, status: 'Completed', date: '2024-03-13' },
    { id: 4, student: 'Emma Wilson', test: 'SAT English Reading', score: 88, maxScore: 100, percentage: 88, time: 62, status: 'Completed', date: '2024-03-12' },
    { id: 5, student: 'David Chen', test: 'CBSE Class 12 Mathematics', score: 45, maxScore: 100, percentage: 45, time: 180, status: 'Failed', date: '2024-03-11' },
  ];

  const filteredResults = results.filter(result =>
    result.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.test.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { title: 'Average Score', value: '77.2%', icon: TrendingUp, color: 'text-blue-600' },
    { title: 'Highest Score', value: '92%', icon: Award, color: 'text-green-600' },
    { title: 'Total Attempts', value: '1,234', icon: Users, color: 'text-purple-600' },
    { title: 'Pass Rate', value: '78%', icon: TrendingUp, color: 'text-orange-600' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Test Results</h1>
          <p className="text-sm md:text-base text-gray-600">View and analyze test performance</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          <Download className="h-4 w-4 mr-2" />
          Export Results
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                  <p className="text-xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color} flex-shrink-0`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by student name or test..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Test Results ({filteredResults.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="all" className="text-xs md:text-sm">All Results</TabsTrigger>
              <TabsTrigger value="passed" className="text-xs md:text-sm">Passed</TabsTrigger>
              <TabsTrigger value="failed" className="text-xs md:text-sm">Failed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4 md:mt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Student</TableHead>
                      <TableHead className="min-w-[180px] hidden md:table-cell">Test</TableHead>
                      <TableHead className="min-w-[80px]">Score</TableHead>
                      <TableHead className="min-w-[120px]">Percentage</TableHead>
                      <TableHead className="min-w-[80px] hidden sm:table-cell">Time</TableHead>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="min-w-[100px] hidden lg:table-cell">Date</TableHead>
                      <TableHead className="min-w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{result.student}</div>
                            <div className="text-xs text-gray-500 md:hidden truncate">{result.test}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{result.test}</TableCell>
                        <TableCell className="text-sm">{result.score}/{result.maxScore}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-12 md:w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${result.percentage >= 70 ? 'bg-green-600' : result.percentage >= 50 ? 'bg-yellow-600' : 'bg-red-600'}`}
                                style={{ width: `${result.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs md:text-sm font-medium">{result.percentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">{result.time} min</TableCell>
                        <TableCell>
                          <Badge variant={result.status === 'Completed' ? 'default' : 'destructive'} className="text-xs">
                            {result.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">{result.date}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="passed" className="mt-4 md:mt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Student</TableHead>
                      <TableHead className="min-w-[180px] hidden md:table-cell">Test</TableHead>
                      <TableHead className="min-w-[80px]">Score</TableHead>
                      <TableHead className="min-w-[120px]">Percentage</TableHead>
                      <TableHead className="min-w-[80px] hidden sm:table-cell">Time</TableHead>
                      <TableHead className="min-w-[100px] hidden lg:table-cell">Date</TableHead>
                      <TableHead className="min-w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.filter(r => r.percentage >= 70).map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{result.student}</div>
                            <div className="text-xs text-gray-500 md:hidden truncate">{result.test}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{result.test}</TableCell>
                        <TableCell className="text-sm">{result.score}/{result.maxScore}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-12 md:w-16 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${result.percentage}%` }}></div>
                            </div>
                            <span className="text-xs md:text-sm font-medium">{result.percentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">{result.time} min</TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">{result.date}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="failed" className="mt-4 md:mt-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Student</TableHead>
                      <TableHead className="min-w-[180px] hidden md:table-cell">Test</TableHead>
                      <TableHead className="min-w-[80px]">Score</TableHead>
                      <TableHead className="min-w-[120px]">Percentage</TableHead>
                      <TableHead className="min-w-[80px] hidden sm:table-cell">Time</TableHead>
                      <TableHead className="min-w-[100px] hidden lg:table-cell">Date</TableHead>
                      <TableHead className="min-w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.filter(r => r.percentage < 70).map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{result.student}</div>
                            <div className="text-xs text-gray-500 md:hidden truncate">{result.test}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{result.test}</TableCell>
                        <TableCell className="text-sm">{result.score}/{result.maxScore}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-12 md:w-16 bg-gray-200 rounded-full h-2">
                              <div className="bg-red-600 h-2 rounded-full" style={{ width: `${result.percentage}%` }}></div>
                            </div>
                            <span className="text-xs md:text-sm font-medium">{result.percentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">{result.time} min</TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">{result.date}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
