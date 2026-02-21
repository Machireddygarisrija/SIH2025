import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
} from '@mui/material';
import {
  CloudUpload,
  Description,
  Delete,
  CheckCircle,
  Error,
  Visibility,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useNotification } from '@/context/NotificationContext';
import { uploadService } from '@/services/uploadService';
import { useApi } from '@/hooks/useApi';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadProgress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const ResumeUploadPage: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { showNotification } = useNotification();

  const { execute: uploadResume, loading } = useApi(uploadService.uploadResume, {
    showSuccessMessage: 'Resume uploaded successfully!',
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      url: '',
      uploadProgress: 0,
      status: 'uploading' as const,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Upload each file
    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      const fileId = newFiles[i].id;

      try {
        const result = await uploadResume(file, (progress: number) => {
          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === fileId ? { ...f, uploadProgress: progress } : f
            )
          );
        });

        if (result) {
          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === fileId
                ? { ...f, status: 'success', url: result.url, uploadProgress: 100 }
                : f
            )
          );
        }
      } catch (error: any) {
        setUploadedFiles(prev =>
          prev.map(f =>
            f.id === fileId
              ? {
                  ...f,
                  status: 'error',
                  error: error.message || 'Upload failed',
                  uploadProgress: 0,
                }
              : f
          )
        );
      }
    }
  }, [uploadResume]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true,
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <Description />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'uploading':
        return 'info';
      default:
        return 'default';
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
            Resume Upload
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Upload your resume to get personalized job recommendations
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed',
                  borderColor: isDragActive ? 'primary.main' : 'grey.300',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: isDragActive ? 'action.hover' : 'transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <input {...getInputProps()} />
                <motion.div
                  animate={{ scale: isDragActive ? 1.1 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                </motion.div>
                <Typography variant="h6" gutterBottom>
                  {isDragActive
                    ? 'Drop your resume here'
                    : 'Drag & drop your resume here'}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  or click to browse files
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Supported formats: PDF, DOC, DOCX (Max 5MB)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upload Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Resume Upload Guidelines:
            </Typography>
            <Typography variant="body2">
              • Use a clear, professional format<br />
              • Include relevant skills, experience, and education<br />
              • Keep it concise (1-2 pages recommended)<br />
              • Use standard fonts and formatting<br />
              • Save as PDF for best compatibility
            </Typography>
          </Alert>
        </motion.div>

        {/* Uploaded Files */}
        <AnimatePresence>
          {uploadedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Uploaded Files
                  </Typography>
                  <List>
                    {uploadedFiles.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ListItem
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            mb: 1,
                          }}
                        >
                          <ListItemIcon>
                            {getStatusIcon(file.status)}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="subtitle2">
                                  {file.name}
                                </Typography>
                                <Chip
                                  label={file.status}
                                  color={getStatusColor(file.status) as any}
                                  size="small"
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="caption" color="textSecondary">
                                  {formatFileSize(file.size)}
                                </Typography>
                                {file.status === 'uploading' && (
                                  <LinearProgress
                                    variant="determinate"
                                    value={file.uploadProgress}
                                    sx={{ mt: 1 }}
                                  />
                                )}
                                {file.error && (
                                  <Typography variant="caption" color="error">
                                    {file.error}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                          <Box display="flex" gap={1}>
                            {file.status === 'success' && file.url && (
                              <IconButton
                                size="small"
                                onClick={() => window.open(file.url, '_blank')}
                              >
                                <Visibility />
                              </IconButton>
                            )}
                            <IconButton
                              size="small"
                              onClick={() => removeFile(file.id)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </DashboardLayout>
  );
};

export default ResumeUploadPage;