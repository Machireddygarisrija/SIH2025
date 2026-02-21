import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Refresh,
  Download,
  Settings,
  Analytics,
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useNotification } from '@/context/NotificationContext';

interface AllocationResult {
  id: string;
  studentName: string;
  studentId: string;
  jobTitle: string;
  company: string;
  matchScore: number;
  status: 'allocated' | 'pending' | 'rejected';
  timestamp: string;
}

const AllocationPanelPage: React.FC = () => {
  const { showNotification } = useNotification();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [allocationSettings, setAllocationSettings] = useState({
    algorithm: 'ai_optimized',
    batchSize: 100,
    matchThreshold: 70,
    diversityWeight: 0.3,
  });

  const mockResults: AllocationResult[] = [
    {
      id: '1',
      studentName: 'John Doe',
      studentId: 'ST001',
      jobTitle: 'Software Engineer Intern',
      company: 'TechCorp',
      matchScore: 95,
      status: 'allocated',
      timestamp: '2024-01-15 10:30:00',
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      studentId: 'ST002',
      jobTitle: 'Data Analyst Intern',
      company: 'DataPro',
      matchScore: 88,
      status: 'allocated',
      timestamp: '2024-01-15 10:31:00',
    },
    {
      id: '3',
      studentName: 'Mike Johnson',
      studentId: 'ST003',
      jobTitle: 'UX Designer Intern',
      company: 'DesignHub',
      matchScore: 92,
      status: 'pending',
      timestamp: '2024-01-15 10:32:00',
    },
  ];

  const [results, setResults] = useState<AllocationResult[]>(mockResults);

  const runAllocation = async () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simulate allocation process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          showNotification('Allocation completed successfully!', 'success');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const stopAllocation = () => {
    setIsRunning(false);
    setProgress(0);
    showNotification('Allocation process stopped', 'warning');
  };

  const exportResults = () => {
    // Mock export functionality
    showNotification('Results exported successfully!', 'success');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'allocated': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'allocated': return <CheckCircle />;
      case 'pending': return <Warning />;
      case 'rejected': return <Error />;
      default: return null;
    }
  };

  const stats = [
    { label: 'Total Students', value: 1250, color: '#1976d2' },
    { label: 'Available Jobs', value: 89, color: '#388e3c' },
    { label: 'Successful Allocations', value: 756, color: '#f57c00' },
    { label: 'Success Rate', value: '87%', color: '#7b1fa2' },
  ];

  return (
    <DashboardLayout>
      <Box>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" gutterBottom>
            AI Allocation Panel
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Manage and monitor the AI-powered internship allocation process
          </Typography>
        </motion.div>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h4" sx={{ color: stat.color, mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Allocation Control Panel
              </Typography>
              
              <Box display="flex" gap={2} mb={3}>
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={runAllocation}
                  disabled={isRunning}
                  color="success"
                >
                  {isRunning ? 'Running...' : 'Start Allocation'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Stop />}
                  onClick={stopAllocation}
                  disabled={!isRunning}
                  color="error"
                >
                  Stop
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  disabled={isRunning}
                >
                  Reset
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Settings />}
                  onClick={() => setSettingsOpen(true)}
                  disabled={isRunning}
                >
                  Settings
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={exportResults}
                >
                  Export Results
                </Button>
              </Box>

              {isRunning && (
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Allocation Progress: {progress}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              )}

              {progress === 100 && !isRunning && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Allocation completed successfully! {results.length} allocations processed.
                </Alert>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Allocation Results
                </Typography>
                <Button startIcon={<Analytics />} size="small">
                  View Analytics
                </Button>
              </Box>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Job Title</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell align="center">Match Score</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell>Timestamp</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2">
                              {result.studentName}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              ID: {result.studentId}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{result.jobTitle}</TableCell>
                        <TableCell>{result.company}</TableCell>
                        <TableCell align="center">
                          <Typography
                            variant="body2"
                            sx={{
                              color: result.matchScore >= 90 ? 'success.main' : 
                                     result.matchScore >= 75 ? 'warning.main' : 'error.main',
                              fontWeight: 'bold',
                            }}
                          >
                            {result.matchScore}%
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={getStatusIcon(result.status)}
                            label={result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                            color={getStatusColor(result.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {result.timestamp}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings Dialog */}
        <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Allocation Settings</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Algorithm</InputLabel>
                  <Select
                    value={allocationSettings.algorithm}
                    label="Algorithm"
                    onChange={(e) => setAllocationSettings({
                      ...allocationSettings,
                      algorithm: e.target.value
                    })}
                  >
                    <MenuItem value="ai_optimized">AI Optimized</MenuItem>
                    <MenuItem value="score_based">Score Based</MenuItem>
                    <MenuItem value="random">Random</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Batch Size"
                  type="number"
                  value={allocationSettings.batchSize}
                  onChange={(e) => setAllocationSettings({
                    ...allocationSettings,
                    batchSize: parseInt(e.target.value)
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Match Threshold (%)"
                  type="number"
                  value={allocationSettings.matchThreshold}
                  onChange={(e) => setAllocationSettings({
                    ...allocationSettings,
                    matchThreshold: parseInt(e.target.value)
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Diversity Weight"
                  type="number"
                  inputProps={{ step: 0.1, min: 0, max: 1 }}
                  value={allocationSettings.diversityWeight}
                  onChange={(e) => setAllocationSettings({
                    ...allocationSettings,
                    diversityWeight: parseFloat(e.target.value)
                  })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
            <Button onClick={() => setSettingsOpen(false)} variant="contained">
              Save Settings
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default AllocationPanelPage;