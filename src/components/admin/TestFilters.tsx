
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

interface TestFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  subjectFilter: string;
  onSubjectFilterChange: (value: string) => void;
  difficultyFilter: string;
  onDifficultyFilterChange: (value: string) => void;
  moduleFilter: string;
  onModuleFilterChange: (value: string) => void;
  planFilter: string;
  onPlanFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

const TestFilters = ({
  searchTerm,
  onSearchChange,
  subjectFilter,
  onSubjectFilterChange,
  difficultyFilter,
  onDifficultyFilterChange,
  moduleFilter,
  onModuleFilterChange,
  planFilter,
  onPlanFilterChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters
}: TestFiltersProps) => {
  const hasActiveFilters = subjectFilter && subjectFilter !== 'all' || 
                          difficultyFilter && difficultyFilter !== 'all' || 
                          moduleFilter && moduleFilter !== 'all' || 
                          planFilter && planFilter !== 'all' || 
                          statusFilter && statusFilter !== 'all';

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tests by name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <Select value={subjectFilter || 'all'} onValueChange={onSubjectFilterChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="Math">Math</SelectItem>
              <SelectItem value="English">English</SelectItem>
            </SelectContent>
          </Select>

          <Select value={difficultyFilter || 'all'} onValueChange={onDifficultyFilterChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <Select value={moduleFilter || 'all'} onValueChange={onModuleFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Module Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="modular">Modular Tests</SelectItem>
              <SelectItem value="single">Single Tests</SelectItem>
            </SelectContent>
          </Select>

          <Select value={planFilter || 'all'} onValueChange={onPlanFilterChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="Free">Free</SelectItem>
              <SelectItem value="Basic">Basic</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter || 'all'} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {subjectFilter && subjectFilter !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                Subject: {subjectFilter}
              </Badge>
            )}
            {difficultyFilter && difficultyFilter !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                Difficulty: {difficultyFilter}
              </Badge>
            )}
            {moduleFilter && moduleFilter !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                Type: {moduleFilter === 'modular' ? 'Modular Tests' : 'Single Tests'}
              </Badge>
            )}
            {planFilter && planFilter !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                Plan: {planFilter}
              </Badge>
            )}
            {statusFilter && statusFilter !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                Status: {statusFilter}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestFilters;
