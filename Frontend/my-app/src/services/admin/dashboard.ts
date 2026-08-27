import apiClient from '@/libs/apiClient';
import type { ApiResponse } from '@/types/auth';
import type { AdminDashboardStats } from '@/types/admin/dashboard';

/**
 * Admin Dashboard service — wraps the .NET Admin Dashboard API.
 *
 * Endpoints:
 *   GET /api/admin/dashboard/stats  → ApiResponse<AdminDashboardStats>
 */

export const adminDashboardService = {
  getStats(options?: { signal?: AbortSignal }): Promise<ApiResponse<AdminDashboardStats>> {
    return apiClient.get<ApiResponse<AdminDashboardStats>>('/api/admin/dashboard/stats', {
      signal: options?.signal,
    });
  },
};

export default adminDashboardService;
