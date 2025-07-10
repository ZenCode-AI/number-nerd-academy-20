
import { apiClient } from '../client';
import { Test } from '@/types/admin';
import { ModularTest } from '@/types/modularTest';
import { ApiResponse, PaginatedResponse } from '../types';
import { modularTestStorage } from '@/services/modularTestStorage';

export const adminTestsAPI = {
  // Get all tests with pagination and filters
  async getTests(params?: {
    page?: number;
    limit?: number;
    status?: string;
    subject?: string;
  }): Promise<PaginatedResponse<Test | ModularTest>> {
    // Mock implementation using storage
    const tests = modularTestStorage.getAll();
    const filteredTests = tests.filter(test => {
      if (params?.status && test.status !== params.status) return false;
      if (params?.subject && !test.modules.some(m => m.subject === params.subject)) return false;
      return true;
    });

    return {
      data: filteredTests,
      success: true,
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: filteredTests.length,
        totalPages: Math.ceil(filteredTests.length / (params?.limit || 10)),
      },
    };
  },

  // Create new test
  async createTest(testData: Omit<ModularTest, 'id' | 'createdAt'>): Promise<ApiResponse<ModularTest>> {
    const newTest = modularTestStorage.create(testData);
    return {
      data: newTest,
      success: true,
      message: 'Test created successfully',
    };
  },

  // Update existing test
  async updateTest(id: string, testData: Partial<ModularTest>): Promise<ApiResponse<ModularTest>> {
    const updatedTest = modularTestStorage.update(id, testData);
    return {
      data: updatedTest,
      success: true,
      message: 'Test updated successfully',
    };
  },

  // Delete test
  async deleteTest(id: string): Promise<ApiResponse<void>> {
    modularTestStorage.delete(id);
    return {
      data: undefined,
      success: true,
      message: 'Test deleted successfully',
    };
  },

  // Get test analytics
  async getTestAnalytics(id: string): Promise<ApiResponse<any>> {
    // Mock analytics data
    return {
      data: {
        totalAttempts: 125,
        averageScore: 78.5,
        completionRate: 89.2,
        difficulty: {
          easy: 45,
          medium: 60,
          hard: 20,
        },
      },
      success: true,
    };
  },
};
