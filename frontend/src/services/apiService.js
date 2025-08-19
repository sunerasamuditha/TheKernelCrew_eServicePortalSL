import axios from 'axios';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Demo data fallback when API is not available
const DEMO_DATA = {
  user: {
    id: '1',
    fullName: 'John Doe',
    email: 'john@example.com',
    role: 'CITIZEN',
    nic: '901234567V',
    mobile: '+94771234567'
  },
  departments: [
    {
      id: '1',
      name: 'Immigration and Emigration',
      code: 'IMM',
      description: 'Immigration and emigration services',
      services: [
        {
          id: '1',
          name: 'New ePassport Application',
          code: 'PASS_NEW',
          description: 'Apply for a new electronic passport',
          fee: 7500.00,
          processingDays: 14
        },
        {
          id: '2',
          name: 'ePassport Renewal',
          code: 'PASS_RENEW',
          description: 'Renew your existing electronic passport',
          fee: 7500.00,
          processingDays: 10
        }
      ]
    }
  ],
  appointments: [
    {
      id: '1',
      appointmentNumber: 'APP2024001',
      appointmentDate: '2024-09-15',
      appointmentTime: '10:00 AM',
      officeLocation: 'Colombo Main Office',
      status: 'SCHEDULED',
      service: {
        name: 'New ePassport Application',
        department: 'Immigration and Emigration'
      }
    }
  ]
};

// Check if API is available
const checkApiAvailability = async () => {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    console.log('API not available, using demo data');
    return false;
  }
};

// API service functions
export const apiService = {
  // Auth
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { success: true, data: { token, user } };
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        // API not available, use demo login
        const demoUser = DEMO_DATA.user;
        const demoToken = 'demo-token-123';
        
        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(demoUser));
        
        return { success: true, data: { token: demoToken, user: demoUser } };
      }
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { success: true, data: { token, user } };
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        // API not available, use demo registration
        const demoUser = { ...DEMO_DATA.user, ...userData, id: Math.random().toString() };
        const demoToken = 'demo-token-123';
        
        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(demoUser));
        
        return { success: true, data: { token: demoToken, user: demoUser } };
      }
      throw error;
    }
  },

  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return { success: true, data: response.data.user };
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        return { success: true, data: DEMO_DATA.user };
      }
      throw error;
    }
  },

  // Services
  async getDepartments() {
    try {
      const response = await api.get('/services/departments');
      return { success: true, data: response.data.departments };
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        return { success: true, data: DEMO_DATA.departments };
      }
      throw error;
    }
  },

  // Appointments
  async getAppointments() {
    try {
      const response = await api.get('/appointments/my');
      return { success: true, data: response.data.appointments };
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        return { success: true, data: DEMO_DATA.appointments };
      }
      throw error;
    }
  },

  async createAppointment(appointmentData) {
    try {
      const response = await api.post('/appointments', appointmentData);
      return { success: true, data: response.data.appointment };
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        const newAppointment = {
          id: Math.random().toString(),
          appointmentNumber: `APP${Date.now()}`,
          ...appointmentData,
          status: 'SCHEDULED'
        };
        return { success: true, data: newAppointment };
      }
      throw error;
    }
  },

  // Utility
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};

export default apiService;
