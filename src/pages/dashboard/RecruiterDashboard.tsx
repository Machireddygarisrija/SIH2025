import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Work,
  People,
  Visibility,
  TrendingUp,
  Add,
  Edit,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuth } from '@/context/AuthContext';

const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Active Jobs', value: 12, icon: <Work />, color: '#1976d2' },
    { title: 'Applications', value: 245, icon: <People />, color: '#388e3c' },
    { title: 'Profile Views', value: 1.2, suffix: 'K', icon: <Visibility />, color: '#f57c00' },
    { title: 'Hire Rate', value: '23%', icon: <TrendingUp />, color: '#7b1fa2' },
  ];

  const jobPostings = [
    { title: 'Software Engineer Intern', applications: 45, views: 120, status: 'Active', deadline: '2024-02-15' },
    { title: 'Data Analyst Intern', applications: 32, views: 89, status: 'Active', deadline: '2024-02-20' },
    { title: 'UX Designer Intern', applications: 28, views: 76, status: 'Closed', deadline: '2024-01-30' },
    { title: 'Marketing Intern', applications: 19, views: 54, status: 'Active', deadline: '2024-02-25' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Closed': return 'error';
      case 'Draft': return 'warning';
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
            Recruiter Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Manage your job postings and applications
          </Typography>
        </motion.div>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="between">
                      <Box>
                        <Typography variant="h4" sx={{ color: stat.color, mb: 1 }}>
                          {stat.value}{stat.suffix || ''}
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
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      fullWidth
                    >
                      Post New Job
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<People />}
                      fullWidth
                    >
                      View Applications
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<TrendingUp />}
                      fullWidth
                    >
                      Analytics
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Job Postings */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">
                      Job Postings
                    </Typography>
                    <Button startIcon={<Add />} size="small">
                      New Job
                    </Button>
                  </Box>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Job Title</TableCell>
                          <TableCell align="center">Applications</TableCell>
                          <TableCell align="center">Views</TableCell>
                          <TableCell align="center">Status</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {jobPostings.map((job, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Box>
                                <Typography variant="subtitle2">
                                  {job.title}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  Deadline: {job.deadline}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2" fontWeight="bold">
                                {job.applications}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2">
                                {job.views}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={job.status}
                                color={getStatusColor(job.status) as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Button size="small" startIcon={<Edit />}>
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default RecruiterDashboard;