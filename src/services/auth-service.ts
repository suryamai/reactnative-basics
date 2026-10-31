import { apiClient, setAuthToken, removeAuthToken } from './api-client';
import { ENDPOINTS } from './apiConfig';

export interface AuthResponse {
  access_token?: string;
  token_type?: string;
  user?: {
    id: string;
    fullName?: string;
    name?: string;
    email: string;
    mobile?: string;
  };
  message?: string;
  status?: string;
}

export interface SignupParams {
  fullName: string;
  email: string;
  password: string;
  mobile: string;
  dob: string;
}

export const loginApi = async (identifier: string, pass: string): Promise<AuthResponse> => {
  const isEmail = identifier.includes('@');
  const payload = isEmail
    ? { email: identifier, password: pass }
    : { phone: identifier, password: pass };

  const data = await apiClient<AuthResponse>(ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (data.access_token) {
    await setAuthToken(data.access_token);
  }

  return data;
};

export const signupApi = async (params: SignupParams): Promise<AuthResponse> => {
  const data = await apiClient<AuthResponse>(ENDPOINTS.SIGNUP, {
    method: 'POST',
    body: JSON.stringify({
      fullName: params.fullName,
      email: params.email,
      password: params.password,
      mobile: params.mobile,
      dob: params.dob,
    }),
  });

  if (data.access_token) {
    await setAuthToken(data.access_token);
  }

  return data;
};

export const logoutApi = async (): Promise<void> => {
  try {
    await apiClient(ENDPOINTS.LOGOUT, { method: 'POST' });
  } catch (e) {
    // ignore
  } finally {
    await removeAuthToken();
  }
};
