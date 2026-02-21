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
} from '@mui/material';
import {
  People,
  Work,
  TrendingUp,
  Assignment,
  AdminPanelSettings,
  Analytics,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuth } from '@/context/AuthContext';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const stats = [
    { title: 'Total Students', value: 1250, icon: <People />, color: '#1976d2' },
    { title: 'Active Jobs', value: 89, icon: <Work />, color: '#388e3c' },
    { title: 'Applications', value: 3420, icon: <Assignment />, color: '#f57c00' },
    { title: 'Success Rate', value: '87%', icon: <TrendingUp />, color: '#7b1fa2' },
  ];

  const recentAllocations = [
    { student: 'John Doe', company: 'Tech Corp', position: 'Software Intern', score: 95, status: 'Allocated' },
    { student: 'Jane Smith', company: 'StartupXYZ', position: 'Data Analyst', score: 92, status: 'Pending' },
    { student: 'Mike Johnson', company: 'BigTech Inc', position: 'Frontend Dev', score: 88, status: 'Allocated' },
    { student: 'Sarah Wilson', company: 'InnovateLab', position: 'UX Designer', score: 90, status: 'Review' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Allocated': return 'success';
      case 'Pending': return 'warning';
      case 'Review': return 'info';
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
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Manage internship allocations and system overview
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
          {/* Admin Actions */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Admin Actions
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Button
                      variant="outlined"
                      startIcon={<AdminPanelSettings />}
                      onClick={() => navigate('/admin/allocation')}
                      fullWidth
                    >
                      Allocation Panel
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Analytics />}
                      fullWidth
                    >
                      Generate Reports
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<People />}
                      fullWidth
                    >
                      Manage Users
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Recent Allocations */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Allocations
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Student</TableCell>
                          <TableCell>Company</TableCell>
                          <TableCell>Position</TableCell>
                          <TableCell align="center">Score</TableCell>
                          <TableCell align="center">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentAllocations.map((allocation, index) => (
                          <TableRow key={index}>
                            <TableCell>{allocation.student}</TableCell>
                            <TableCell>{allocation.company}</TableCell>
                            <TableCell>{allocation.position}</TableCell>
                            <TableCell align="center">
                              <Typography
                                variant="body2"
                                sx={{
                                  color: allocation.score >= 90 ? 'success.main' : 'text.primary',
                                  fontWeight: 'bold',
                                }}
                              >
                                {allocation.score}%
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={allocation.status}
                                color={getStatusColor(allocation.status) as any}
                                size="small"
                              />
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

export default AdminDashboard;