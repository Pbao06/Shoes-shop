/**
 * Admin Dashboard types mirrored from the .NET backend.
 *
 * Backend sources:
 *   - DTOs/DashboardStatsDto.cs
 *   - Services/Admin/AdminDashboardService.cs
 *   - Controllers/Admin/AdminDashboardController.cs
 */

import type { ApiResponse } from '@/types/auth';

/** Dashboard statistics response. */
export interface AdminDashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
  recentOrders: AdminRecentOrder[];
}

/** Recent order item in dashboard stats. */
export interface AdminRecentOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}
