import apiClient from "@/libs/apiClient";
import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";

/**
 * Auth service — wraps the backend AuthController endpoints.
 *
 * Endpoints (Backend/Source/src/Controllers/AuthController.cs):
 *   POST /api/Auth/login     → LoginResponse
 *   POST /api/Auth/register  → RegisterResponse
 */
export const authService = {
  login(payload: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<ApiResponse<LoginResponse>>("/api/Auth/login", payload);
  },

  register(payload: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    return apiClient.post<ApiResponse<RegisterResponse>>("/api/Auth/register", payload);
  },
};

export default authService;