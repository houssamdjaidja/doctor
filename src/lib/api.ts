/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Une erreur est survenue');
  return data;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; patient: any }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) =>
    request<{ message: string; email: string; debug_code?: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  verifyEmail: (email: string, code: string) =>
    request<{ token: string; patient: any }>('/auth/verify-email', { method: 'POST', body: JSON.stringify({ email, code }) }),
  resendCode: (email: string) =>
    request<{ message: string; debug_code?: string }>('/auth/resend-code', { method: 'POST', body: JSON.stringify({ email }) }),
  forgotPassword: (email: string) =>
    request<{ message: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (email: string, code: string, password: string) =>
    request<{ message: string }>('/auth/reset-password', { method: 'POST', body: JSON.stringify({ email, code, password }) }),
  adminLogin: (username: string, password: string) =>
    request<{ token: string; admin: any }>('/auth/admin/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  getMe: () => request<any>('/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<any>('/auth/password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }),
  changeAdminPassword: (currentPassword: string, newPassword: string) =>
    request<any>('/auth/admin/password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }),

  // Appointments
  getAvailableSlots: (date: string) =>
    request<{ date: string; available: string[] }>(`/appointments/available?date=${encodeURIComponent(date)}`),
  createAppointment: (data: any) =>
    request<any>('/appointments', { method: 'POST', body: JSON.stringify(data) }),
  getAppointments: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params) : '';
    return request<any[]>(`/appointments${qs}`);
  },
  getAppointment: (id: number) => request<any>(`/appointments/${id}`),
  updateAppointment: (id: number, data: any) =>
    request<any>(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  cancelAppointment: (id: number) =>
    request<any>(`/appointments/${id}/cancel`, { method: 'PATCH' }),

  // Blog
  getBlogPosts: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params) : '';
    return request<any[]>(`/blog${qs}`);
  },
  getBlogPost: (id: string) => request<any>(`/blog/${id}`),
  createBlogPost: (data: any) =>
    request<any>('/blog', { method: 'POST', body: JSON.stringify(data) }),
  updateBlogPost: (id: number, data: any) =>
    request<any>(`/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBlogPost: (id: number) =>
    request<any>(`/blog/${id}`, { method: 'DELETE' }),

  // Contact
  sendContact: (data: any) =>
    request<any>('/contact', { method: 'POST', body: JSON.stringify(data) }),
  getMessages: (read?: string) => {
    const qs = read !== undefined ? `?read=${read}` : '';
    return request<any[]>(`/contact${qs}`);
  },
  markMessageRead: (id: number) =>
    request<any>(`/contact/${id}/read`, { method: 'PUT' }),
  deleteMessage: (id: number) =>
    request<any>(`/contact/${id}`, { method: 'DELETE' }),

  // Patient Messages
  getPatientMessages: () => request<any[]>('/messages'),
  getAdminMessages: () => request<any[]>('/messages/all'),
  sendPatientMessage: (subject: string, message: string) =>
    request<any>('/messages', { method: 'POST', body: JSON.stringify({ subject, message }) }),
  replyToMessage: (id: number, reply: string) =>
    request<any>(`/messages/${id}/reply`, { method: 'PUT', body: JSON.stringify({ reply }) }),
  markMessageReadPatient: (id: number) =>
    request<any>(`/messages/${id}/read`, { method: 'PUT' }),

  // Documents
  getDocuments: (patient_id?: number) => {
    const qs = patient_id ? `?patient_id=${patient_id}` : '';
    return request<any[]>(`/documents${qs}`);
  },
  uploadDocument: (data: { name: string; file_type: string; file_data: string }) =>
    request<any>('/documents', { method: 'POST', body: JSON.stringify(data) }),
  downloadDocument: (id: number) => request<any>(`/documents/${id}/download`),
  deleteDocument: (id: number) =>
    request<any>(`/documents/${id}`, { method: 'DELETE' }),

  // FAQ
  getFaq: () => request<any[]>('/faq'),

  // Settings
  getSettings: () => request<Record<string, string>>('/settings'),
  updateSettings: (data: any) =>
    request<Record<string, string>>('/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // Admin
  getAdminStats: () => request<any>('/admin/stats'),
  exportPatients: () => fetch(`${BASE_URL}/admin/patients/export`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
  }),

  // Patients
  getPatients: () => request<any[]>('/patients'),
  getPatientMe: () => request<any>('/patients/me'),
  updatePatientMe: (data: any) =>
    request<any>('/patients/me', { method: 'PUT', body: JSON.stringify(data) }),
};
