import { User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

type AuthPayload = {
  email: string;
  password: string;
};

type SignupPayload = AuthPayload & {
  name: string;
  age: number;
  avatar: string;
  parentalConsent: boolean;
};

type AuthResponse = {
  user: User;
};

type UserProgressPayload = Pick<
  User,
  'xp' | 'level' | 'badges' | 'completedLessons' | 'completedGames'
>;

const request = async <T>(
  path: string,
  options?: {
    method?: 'GET' | 'POST' | 'PATCH';
    payload?: unknown;
  }
): Promise<T> => {
  const { method = 'GET', payload } = options ?? {};

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error || 'Request failed.');
  }

  return response.json() as Promise<T>;
};

export const loginUser = async (payload: AuthPayload) => {
  const response = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    payload,
  });
  return response.user;
};

export const signupUser = async (payload: SignupPayload) => {
  const response = await request<AuthResponse>('/auth/signup', {
    method: 'POST',
    payload,
  });
  return response.user;
};

export const syncUserProgress = async (userId: string, payload: UserProgressPayload) => {
  const response = await request<AuthResponse>(`/users/${userId}/progress`, {
    method: 'PATCH',
    payload,
  });
  return response.user;
};
