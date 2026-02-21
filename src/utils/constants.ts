export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  JOBS: {
    LIST: '/jobs',
    RECOMMENDATIONS: '/jobs/recommendations',
    APPLY: '/jobs/apply',
    APPLICATIONS: '/applications',
  },
  UPLOAD: {
    RESUME: '/upload/resume',
    DOCUMENT: '/upload/document',
  },
  ADMIN: {
    USERS: '/admin/users',
    ALLOCATIONS: '/admin/allocations',
    ANALYTICS: '/admin/analytics',
  },
};

export const USER_ROLES = {
  STUDENT: 'student',
  RECRUITER: 'recruiter',
  ADMIN: 'admin',
} as const;

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted',
} as const;

export const FILE_TYPES = {
  RESUME: {
    ACCEPTED: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
  },
  IMAGE: {
    ACCEPTED: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    MAX_SIZE: 2 * 1024 * 1024, // 2MB
  },
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;