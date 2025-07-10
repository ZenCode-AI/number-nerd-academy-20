
import { apiClient } from '../client';
import { User } from '@/types/user';
import { ApiResponse, PaginatedResponse } from '../types';

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByPlan: {
    Free: number;
    Basic: number;
    Standard: number;
    Premium: number;
  };
}

export const adminUsersAPI = {
  // Get all users with pagination and filters
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    plan?: string;
    search?: string;
  }): Promise<PaginatedResponse<User>> {
    // Mock implementation
    const mockUsers: User[] = [
      {
        id: 'user-1',
        email: 'student1@example.com',
        name: 'John Doe',
        role: 'student',
        plan: 'Free',
        isAuthenticated: true,
      },
      {
        id: 'user-2',
        email: 'student2@example.com',
        name: 'Jane Smith',
        role: 'student',
        plan: 'Premium',
        isAuthenticated: true,
      },
    ];

    return {
      data: mockUsers,
      success: true,
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: mockUsers.length,
        totalPages: Math.ceil(mockUsers.length / (params?.limit || 10)),
      },
    };
  },

  // Get user statistics
  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return {
      data: {
        totalUsers: 1250,
        activeUsers: 890,
        newUsersThisMonth: 45,
        usersByPlan: {
          Free: 800,
          Basic: 250,
          Standard: 150,
          Premium: 50,
        },
      },
      success: true,
    };
  },

  // Update user
  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    // Mock implementation
    const updatedUser: User = {
      id,
      email: 'updated@example.com',
      name: 'Updated User',
      role: 'student',
      plan: 'Basic',
      isAuthenticated: true,
      ...userData,
    };

    return {
      data: updatedUser,
      success: true,
      message: 'User updated successfully',
    };
  },

  // Delete user
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return {
      data: undefined,
      success: true,
      message: 'User deleted successfully',
    };
  },
};
