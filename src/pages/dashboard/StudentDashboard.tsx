import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Work,
  Upload,
  Person,
  TrendingUp,
  Assignment,
  Notifications,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuth } from '@/context/AuthContext';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const stats = [
    { title: 'Applications Sent', value: 12, icon: <Assignment />, color: '#1976d2' },
    { title: 'Profile Views', value: 45, icon: <Person />, color: '#388e3c' },
    { title: 'Recommendations', value: 8, icon: <Work />, color: '#f57c00' },
    { title: 'Interview Calls', value: 3, icon: <TrendingUp />, color: '#7b1fa2' },
  ];

  const recentApplications = [
    { company: 'Tech Corp', position: 'Software Intern', status: 'Under Review', date: '2024-01-15' },
    { company: 'StartupXYZ', position: 'Data Analyst', status: 'Shortlisted', date: '2024-01-12' },
    { company: 'BigTech Inc', position: 'Frontend Developer', status: 'Applied', date: '2024-01-10' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Shortlisted': return 'success';
      case 'Under Review': return 'warning';
      case 'Applied': return 'info';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <Box>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome back, {user?.name}!
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Here's your internship journey overview
          </Typography>
        </motion.div>

        {/* Profile Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                    Profile Completion
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Complete your profile to get better recommendations
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h4" sx={{ color: 'white' }}>
                    75%
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={75}
                sx={{
                  mt: 2,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white',
                  },
                }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="between">
                      <Box>
                        <Typography variant="h4" sx={{ color: stat.color, mb: 1 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {stat.title}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: stat.color, ml: 2 }}>
                        {stat.icon}
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Button
                      variant="outlined"
                      startIcon={<Upload />}
                      onClick={() => navigate('/resume-upload')}
                      fullWidth
                    >
                      Upload Resume
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Work />}
                      onClick={() => navigate('/job-recommendations')}
                      fullWidth
                    >
                      View Recommendations
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Person />}
                      onClick={() => navigate('/profile')}
                      fullWidth
                    >
                      Update Profile
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Recent Applications */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Applications
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    {recentApplications.map((app, index) => (
                      <Box
                        key={index}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        p={2}
                        sx={{
                          backgroundColor: 'rgba(0,0,0,0.02)',
                          borderRadius: 1,
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle2">
                            {app.position}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {app.company} • {app.date}
                          </Typography>
                        </Box>
                        <Chip
                          label={app.status}
                          color={getStatusColor(app.status) as any}
                          size="small"
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default StudentDashboard;