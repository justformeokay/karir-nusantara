import { apiRequest, ApiResponse } from './client';

// ============================================
// TYPES
// ============================================

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  email?: string;
}

export interface MessageResponse {
  message: string;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Request password reset - sends email with reset link
 */
export async function forgotPassword(email: string): Promise<MessageResponse> {
  const response = await apiRequest<MessageResponse>('/password-reset/forgot', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  
  if (response.data) {
    return response.data;
  }
  
  return { message: response.message || 'Email reset password telah dikirim' };
}

/**
 * Verify reset token validity
 */
export async function verifyResetToken(token: string): Promise<VerifyTokenResponse> {
  const response = await apiRequest<VerifyTokenResponse>(`/password-reset/verify?token=${encodeURIComponent(token)}`);
  
  if (response.data) {
    return response.data;
  }
  
  return response as unknown as VerifyTokenResponse;
}

/**
 * Reset password using token
 */
export async function resetPassword(token: string, newPassword: string): Promise<MessageResponse> {
  const response = await apiRequest<MessageResponse>('/password-reset/reset', {
    method: 'POST',
    body: JSON.stringify({
      token,
      new_password: newPassword,
    }),
  });
  
  if (response.data) {
    return response.data;
  }
  
  return { message: response.message || 'Password berhasil diubah' };
}
