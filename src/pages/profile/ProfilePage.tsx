import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Add,
  Delete,
  Person,
  School,
  Work,
  Code,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 9876543210',
    location: 'Bangalore, India',
    bio: 'Passionate software developer with experience in full-stack development.',
    education: 'B.Tech Computer Science, IIT Delhi',
    experience: '2 years of internship experience',
    skills: ['React', 'Node.js', 'Python', 'JavaScript', 'MongoDB'],
    interests: ['Web Development', 'Machine Learning', 'Open Source'],
  });
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const profileCompletion = 85;

  const handleSave = () => {
    // Update user profile
    updateUser({ name: profileData.name });
    showNotification('Profile updated successfully!', 'success');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData({
      ...profileData,
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(skill => skill !== skillToRemove),
    });
  };

  const addInterest = () => {
    if (newInterest.trim() && !profileData.interests.includes(newInterest.trim())) {
      setProfileData({
        ...profileData,
        interests: [...profileData.interests, newInterest.trim()],
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setProfileData({
      ...profileData,
      interests: profileData.interests.filter(interest => interest !== interestToRemove),
    });
  };

  return (
    <DashboardLayout>
      <Box>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">
              Profile
            </Typography>
            {!isEditing ? (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <Box display="flex" gap={1}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        </motion.div>

        {/* Profile Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="between">
                <Box>
                  <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                    Profile Completion
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Complete your profile to get better job matches
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h4" sx={{ color: 'white' }}>
                    {profileCompletion}%
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={profileCompletion}
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

        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Person color="primary" />
                    <Typography variant="h6">Basic Information</Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="center" mb={3}>
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: 'primary.main',
                        fontSize: '2rem',
                      }}
                    >
                      {profileData.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={profileData.email}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bio"
                        multiline
                        rows={3}
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        disabled={!isEditing}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Education & Experience */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <School color="primary" />
                    <Typography variant="h6">Education & Experience</Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Education"
                        value={profileData.education}
                        onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Experience"
                        multiline
                        rows={3}
                        value={profileData.experience}
                        onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                        disabled={!isEditing}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Skills */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Code color="primary" />
                    <Typography variant="h6">Skills</Typography>
                  </Box>

                  {isEditing && (
                    <Box display="flex" gap={1} mb={2}>
                      <TextField
                        size="small"
                        label="Add Skill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      />
                      <IconButton onClick={addSkill} color="primary">
                        <Add />
                      </IconButton>
                    </Box>
                  )}

                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {profileData.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={isEditing ? () => removeSkill(skill) : undefined}
                        deleteIcon={<Delete />}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Interests */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Work color="primary" />
                    <Typography variant="h6">Interests</Typography>
                  </Box>

                  {isEditing && (
                    <Box display="flex" gap={1} mb={2}>
                      <TextField
                        size="small"
                        label="Add Interest"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                      />
                      <IconButton onClick={addInterest} color="primary">
                        <Add />
                      </IconButton>
                    </Box>
                  )}

                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {profileData.interests.map((interest, index) => (
                      <Chip
                        key={index}
                        label={interest}
                        onDelete={isEditing ? () => removeInterest(interest) : undefined}
                        deleteIcon={<Delete />}
                        color="secondary"
                        variant="outlined"
                      />
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

export default ProfilePage;