
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Clock, Play, ShoppingCart, Lock, Trophy, Star, Search, Filter, SortAsc } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TestGridProps {
  tests: any[];
  onStartTest: (testId: string, hasAccess: boolean) => void;
  onPurchaseTest: (test: any) => void;
  showFilters?: boolean;
}

export const TestGrid = ({ tests, onStartTest, onPurchaseTest, showFilters = false }: TestGridProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterAttempted, setFilterAttempted] = useState('all');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      case 'Mixed': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Free': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Basic': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Standard': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Premium': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTestAction = (test: any) => {
    if (!user) {
      navigate('/signin');
      return;
    }

    if (test.hasAccess) {
      onStartTest(test.id, true);
    } else {
      onPurchaseTest(test);
    }
  };

  const getTestScore = (testId: string) => {
    const attempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
    const testAttempts = attempts.filter((attempt: any) => attempt.testId === testId);
    if (testAttempts.length === 0) return null;
    
    const bestScore = Math.max(...testAttempts.map((attempt: any) => attempt.score || 0));
    return bestScore;
  };

  const getAttemptCount = (testId: string) => {
    const attempts = JSON.parse(localStorage.getItem('testAttempts') || '[]');
    return attempts.filter((attempt: any) => attempt.testId === testId).length;
  };

  const filteredAndSortedTests = tests
    .filter(test => {
      const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           test.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterAttempted === 'attempted') {
        return matchesSearch && getTestScore(test.id) !== null;
      } else if (filterAttempted === 'not-attempted') {
        return matchesSearch && getTestScore(test.id) === null;
      }
      
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3, 'Mixed': 4 };
          return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 5) - 
                 (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 5);
        case 'duration':
          return a.duration - b.duration;
        case 'questions':
          return a.questions - b.questions;
        case 'score':
          const scoreA = getTestScore(a.id) || 0;
          const scoreB = getTestScore(b.id) || 0;
          return scoreB - scoreA;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (tests.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No tests found</h3>
        <p className="text-gray-500">Try adjusting your filters or check back later for new tests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Tests</label>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="difficulty">Difficulty</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                    <SelectItem value="questions">Questions</SelectItem>
                    <SelectItem value="score">Best Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Progress</label>
                <Select value={filterAttempted} onValueChange={setFilterAttempted}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tests</SelectItem>
                    <SelectItem value="attempted">Attempted</SelectItem>
                    <SelectItem value="not-attempted">Not Attempted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSortBy('name');
                    setFilterAttempted('all');
                  }}
                  className="w-full"
                >
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedTests.map((test) => {
          const bestScore = getTestScore(test.id);
          const attemptCount = getAttemptCount(test.id);
          const hasAttempted = bestScore !== null;
          
          return (
            <Card key={test.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {test.name}
                    </CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={`${getDifficultyColor(test.difficulty)} border font-medium`}>
                        {test.difficulty}
                      </Badge>
                      <Badge className={`${getPlanColor(test.plan)} border font-medium`}>
                        {test.plan}
                      </Badge>
                      {test.isPurchased && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">
                          Owned
                        </Badge>
                      )}
                      {!test.hasAccess && test.plan !== 'Free' && (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 font-medium">
                          <Lock className="h-3 w-3 mr-1" />
                          Locked
                        </Badge>
                      )}
                      {hasAttempted && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                          <Trophy className="h-3 w-3 mr-1" />
                          Best: {bestScore}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  {test.moduleCount && (
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-700">{test.moduleCount}</div>
                      <div className="text-xs text-gray-500">modules</div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {test.description || 'Comprehensive practice test with carefully crafted questions to help you excel.'}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{test.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="h-4 w-4" />
                    <span className="font-medium">{test.questions} questions</span>
                  </div>
                  {hasAttempted && (
                    <div className="flex items-center gap-1 text-blue-600">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-medium text-xs">{attemptCount}x</span>
                    </div>
                  )}
                </div>

                {hasAttempted && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress:</span>
                      <span className="font-semibold text-gray-900">{attemptCount} attempt{attemptCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((bestScore || 0), 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {test.hasAccess ? (
                  <Button 
                    onClick={() => handleTestAction(test)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    size="lg"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {hasAttempted ? 'Retake Test' : 'Start Test'}
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleTestAction(test)}
                    className="w-full"
                    size="lg"
                    variant={test.plan === 'Free' ? 'default' : 'outline'}
                  >
                    {test.plan === 'Free' ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Free Test
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Purchase Access
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAndSortedTests.length === 0 && tests.length > 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No tests match your filters</h3>
          <p className="text-gray-500">Try adjusting your search terms or filters to see more results.</p>
        </div>
      )}
    </div>
  );
};
