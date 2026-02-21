import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Work,
  LocationOn,
  Schedule,
  AttachMoney,
  Favorite,
  FavoriteBorder,
  Share,
  Apply,
  TrendingUp,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { jobService } from '@/services/jobService';
import { useApiEffect } from '@/hooks/useApi';

interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
  type: string;
  salary?: string;
  postedDate: string;
  deadline: string;
  matchScore: number;
  matchReasons: string[];
  isFavorite?: boolean;
}

const JobRecommendationsPage: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [selectedJob, setSelectedJob] = useState<JobRecommendation | null>(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const { data: recommendations, loading } = useApiEffect(
    () => jobService.getRecommendations(user?.id || ''),
    [user?.id]
  );

  const mockRecommendations: JobRecommendation[] = [
    {
      id: '1',
      title: 'Software Engineer Intern',
      company: 'TechCorp Solutions',
      description: 'Join our dynamic team to work on cutting-edge web applications using React, Node.js, and cloud technologies.',
      requirements: ['React', 'JavaScript', 'Node.js', 'Git'],
      location: 'Bangalore, India',
      type: 'Internship',
      salary: '₹25,000/month',
      postedDate: '2024-01-10',
      deadline: '2024-02-15',
      matchScore: 95,
      matchReasons: ['Strong React skills match', 'JavaScript expertise', 'Location preference'],
    },
    {
      id: '2',
      title: 'Data Science Intern',
      company: 'Analytics Pro',
      description: 'Work with large datasets and machine learning models to derive business insights.',
      requirements: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
      location: 'Hyderabad, India',
      type: 'Internship',
      salary: '₹30,000/month',
      postedDate: '2024-01-12',
      deadline: '2024-02-20',
      matchScore: 88,
      matchReasons: ['Python proficiency', 'ML background', 'Data analysis skills'],
    },
    {
      id: '3',
      title: 'UX Designer Intern',
      company: 'Design Studio',
      description: 'Create intuitive user experiences for mobile and web applications.',
      requirements: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
      location: 'Mumbai, India',
      type: 'Internship',
      salary: '₹22,000/month',
      postedDate: '2024-01-08',
      deadline: '2024-02-10',
      matchScore: 82,
      matchReasons: ['Design portfolio match', 'Figma expertise', 'Creative background'],
    },
  ];

  const displayRecommendations = recommendations || mockRecommendations;

  const toggleFavorite = (jobId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(jobId)) {
        newFavorites.delete(jobId);
        showNotification('Removed from favorites', 'info');
      } else {
        newFavorites.add(jobId);
        showNotification('Added to favorites', 'success');
      }
      return newFavorites;
    });
  };

  const handleApply = async () => {
    if (!selectedJob) return;

    try {
      // await jobService.applyToJob(selectedJob.id, { coverLetter });
      showNotification('Application submitted successfully!', 'success');
      setApplyDialogOpen(false);
      setCoverLetter('');
      setSelectedJob(null);
    } catch (error) {
      showNotification('Failed to submit application', 'error');
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 75) return 'warning';
    return 'error';
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
            Job Recommendations
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            AI-powered job matches based on your profile and preferences
          </Typography>
        </motion.div>

        {loading && (
          <Box sx={{ width: '100%', mb: 3 }}>
            <LinearProgress />
          </Box>
        )}

        <Grid container spacing={3}>
          {displayRecommendations.map((job, index) => (
            <Grid item xs={12} key={job.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card sx={{ position: 'relative', overflow: 'visible' }}>
                  {/* Match Score Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: 20,
                      zIndex: 1,
                    }}
                  >
                    <Chip
                      icon={<TrendingUp />}
                      label={`${job.matchScore}% Match`}
                      color={getMatchScoreColor(job.matchScore)}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

                  <CardContent sx={{ pt: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={8}>
                        <Box display="flex" alignItems="start" gap={2} mb={2}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <Work />
                          </Avatar>
                          <Box flex={1}>
                            <Typography variant="h6" gutterBottom>
                              {job.title}
                            </Typography>
                            <Typography variant="subtitle1" color="primary" gutterBottom>
                              {job.company}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <LocationOn fontSize="small" color="action" />
                                <Typography variant="body2" color="textSecondary">
                                  {job.location}
                                </Typography>
                              </Box>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <Schedule fontSize="small" color="action" />
                                <Typography variant="body2" color="textSecondary">
                                  {job.type}
                                </Typography>
                              </Box>
                              {job.salary && (
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <AttachMoney fontSize="small" color="action" />
                                  <Typography variant="body2" color="textSecondary">
                                    {job.salary}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>

                        <Typography variant="body2" color="textSecondary" paragraph>
                          {job.description}
                        </Typography>

                        <Box mb={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            Required Skills:
                          </Typography>
                          <Box display="flex" flexWrap="wrap" gap={1}>
                            {job.requirements.map((skill, idx) => (
                              <Chip key={idx} label={skill} size="small" variant="outlined" />
                            ))}
                          </Box>
                        </Box>

                        <Box mb={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            Why this matches you:
                          </Typography>
                          {job.matchReasons.map((reason, idx) => (
                            <Typography key={idx} variant="body2" color="textSecondary">
                              • {reason}
                            </Typography>
                          ))}
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Box display="flex" flexDirection="column" gap={2} height="100%">
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              Match Score
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={job.matchScore}
                              color={getMatchScoreColor(job.matchScore)}
                              sx={{ height: 8, borderRadius: 4, mb: 1 }}
                            />
                            <Typography variant="caption" color="textSecondary">
                              {job.matchScore}% compatibility
                            </Typography>
                          </Box>

                          <Divider />

                          <Box>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              Application Deadline
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {new Date(job.deadline).toLocaleDateString()}
                            </Typography>
                          </Box>

                          <Box mt="auto">
                            <Box display="flex" gap={1} mb={2}>
                              <IconButton
                                onClick={() => toggleFavorite(job.id)}
                                color={favorites.has(job.id) ? 'error' : 'default'}
                              >
                                {favorites.has(job.id) ? <Favorite /> : <FavoriteBorder />}
                              </IconButton>
                              <IconButton>
                                <Share />
                              </IconButton>
                            </Box>
                            <Button
                              variant="contained"
                              fullWidth
                              startIcon={<Apply />}
                              onClick={() => {
                                setSelectedJob(job);
                                setApplyDialogOpen(true);
                              }}
                            >
                              Apply Now
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Apply Dialog */}
        <Dialog
          open={applyDialogOpen}
          onClose={() => setApplyDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Apply for {selectedJob?.title}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {selectedJob?.company} • {selectedJob?.location}
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Cover Letter"
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write a brief cover letter explaining why you're interested in this position..."
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setApplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} variant="contained">
              Submit Application
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default JobRecommendationsPage;