import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL ?? 'https://billsplitter-lwz8w.sevalla.app';
console.log('API URL:', API_URL); 


const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json', 
  },
  withCredentials: true,
});

// Request interceptor to add CSRF token
api.interceptors.request.use((config) => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (token) {
    config.headers['X-CSRF-TOKEN'] = token;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/login', credentials),
  register: (userData: { name: string; email: string; password: string; password_confirmation: string }) =>
    api.post('/register', userData),
  logout: () => api.post('/logout'),
  user: () => api.get('/user'),
};

// Dashboard API
export const dashboardAPI = {
  getData: () => api.get('/dashboard'),
};

// Groups API
export const groupsAPI = {
  getAll: () => api.get('/groups'),
  getOne: (id: number) => api.get(`/groups/${id}`),
  create: (data: { name: string; description?: string }) =>
    api.post('/groups', data),
  update: (id: number, data: { name: string; description?: string }) =>
    api.patch(`/groups/${id}`, data),
  delete: (id: number) => api.delete(`/groups/${id}`),
};

// Expenses API
export const expensesAPI = {
  getAll: () => api.get('/expenses'),
  getOne: (id: number) => api.get(`/expenses/${id}`),
  create: (data: any) => api.post('/expenses', data),
  update: (id: number, data: any) => api.patch(`/expenses/${id}`, data),
  delete: (id: number) => api.delete(`/expenses/${id}`),
};

// Settlements API
export const settlementsAPI = {
  getAll: () => api.get('/settlements'),
  create: (data: any) => api.post('/settlements', data),
  updateStatus: (id: number, status: string) =>
    api.patch(`/settlements/${id}/status`, { status }),
};

// Invites API
export const invitesAPI = {
  getAll: () => api.get('/invites'),
  create: (data: any) => api.post('/invites', data),
  accept: (id: number) => api.patch(`/invites/${id}/accept`),
};

// Reports API
export const reportsAPI = {
  getDashboard: () => api.get('/reports'),
  getGroupReport: (groupId: number) => api.get(`/reports/group/${groupId}`),
  export: (data: any) => api.post('/reports/export', data),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

export default api; 