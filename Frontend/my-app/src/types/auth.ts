/**
 * Auth DTOs mirrored from the .NET backend
 * (Backend/Source/src/DTOs/{LoginDto,LoginResponseDto,RegisterDto,RegisterResponseDto}.cs).
 *
 * Property names follow the camelCase JSON convention used by ASP.NET Core.
 */

/** POST /api/Auth/login — request body. */
export interface LoginRequest {
  email: string;
  password: string;
}

/** POST /api/Auth/login — response `data` payload. */
export interface LoginResponse {
  id: number;
  userName: string;
  email: string;
  token: string;
}

/** POST /api/Auth/register — request body. */
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/** POST /api/Auth/register — response `data` payload. */
export interface RegisterResponse {
  message: string;
  email: string;
}

/** Successful API envelope produced by the base controller. */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/** Error envelope produced by the exception middleware. */
export interface ApiErrorResponse {
  success: boolean;
  message: string;
  statusCode: number;
}