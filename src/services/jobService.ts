import { apiService } from './api';

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
  type: 'internship' | 'full-time' | 'part-time';
  salary?: string;
  postedDate: string;
  deadline: string;
  status: 'active' | 'closed';
}

interface JobRecommendation {
  job: Job;
  matchScore: number;
  matchReasons: string[];
}

interface JobApplication {
  id: string;
  jobId: string;
  studentId: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
  appliedDate: string;
  coverLetter?: string;
  resumeUrl?: string;
}

class JobService {
  async getJobs(filters?: any): Promise<Job[]> {
    return apiService.get('/jobs', { params: filters });
  }

  async getJobById(id: string): Promise<Job> {
    return apiService.get(`/jobs/${id}`);
  }

  async getRecommendations(studentId: string): Promise<JobRecommendation[]> {
    return apiService.get(`/jobs/recommendations/${studentId}`);
  }

  async applyToJob(jobId: string, applicationData: any): Promise<JobApplication> {
    return apiService.post(`/jobs/${jobId}/apply`, applicationData);
  }

  async getApplications(studentId?: string): Promise<JobApplication[]> {
    const url = studentId ? `/applications/student/${studentId}` : '/applications';
    return apiService.get(url);
  }

  async updateApplicationStatus(applicationId: string, status: string): Promise<JobApplication> {
    return apiService.put(`/applications/${applicationId}/status`, { status });
  }

  async createJob(jobData: Omit<Job, 'id' | 'postedDate'>): Promise<Job> {
    return apiService.post('/jobs', jobData);
  }

  async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    return apiService.put(`/jobs/${id}`, jobData);
  }

  async deleteJob(id: string): Promise<void> {
    return apiService.delete(`/jobs/${id}`);
  }
}

export const jobService = new JobService();