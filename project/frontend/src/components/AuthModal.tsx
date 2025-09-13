import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Eye, EyeOff, MapPin, Briefcase, GraduationCap, Users } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { loginUser, registerUser } from '../redux/slices/authSlice';
import { AppDispatch } from '../redux/store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  initialRole?: string;
}

const roles = [
  { value: 'applicant', label: 'Student Applicant', icon: GraduationCap, color: 'from-blue-500 to-purple-600' },
  { value: 'mentor', label: 'Industry Mentor', icon: Users, color: 'from-green-500 to-blue-600' },
  { value: 'recruiter', label: 'Company Recruiter', icon: Briefcase, color: 'from-orange-500 to-red-600' },
  { value: 'admin', label: 'System Admin', icon: Users, color: 'from-purple-500 to-pink-600' }
];

export default function AuthModal({ isOpen, onClose, mode, initialRole = '' }: AuthModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [currentMode, setCurrentMode] = useState(mode);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: initialRole,
    phone: '',
    location: '',
    skills: '',
    qualifications: '',
    experience: '',
    company: '',
    designation: '',
    socialCategory: '',
    isRural: false,
    isPwD: false,
    documents: {
      marksMemo: null as File | null,
      pan: null as File | null,
      aadhaar: null as File | null,
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      documents: { ...prev.documents, [field]: file }
    }));
  };

  const validateStep = (stepNumber: number) => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (currentMode === 'register') {
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.role) newErrors.role = 'Please select a role';
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
      }
    }

    if (stepNumber === 2 && currentMode === 'register') {
      if (formData.role === 'applicant') {
        if (!formData.skills) newErrors.skills = 'Skills are required';
        if (!formData.qualifications) newErrors.qualifications = 'Qualifications are required';
      }
      if (formData.role === 'recruiter' && !formData.company) {
        newErrors.company = 'Company name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentMode === 'login') {
      if (validateStep(1)) {
        try {
          await dispatch(loginUser({
            email: formData.email,
            password: formData.password,
            role: formData.role
          })).unwrap();
          onClose();
        } catch (error) {
          setErrors({ submit: 'Login failed. Please check your credentials.' });
        }
      }
    } else {
      if (step < 3) {
        if (validateStep(step)) {
          setStep(step + 1);
        }
      } else {
        try {
          await dispatch(registerUser(formData)).unwrap();
          onClose();
        } catch (error) {
          setErrors({ submit: 'Registration failed. Please try again.' });
        }
      }
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {currentMode === 'register' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Your Role</label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <motion.button
                  key={role.value}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange('role', role.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.role === role.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <role.icon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm font-medium text-gray-900">{role.label}</p>
                </motion.button>
              ))}
            </div>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Enter your email"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      {currentMode === 'register' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
      )}
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="+91 XXXXXXXXXX"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className="relative">
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pl-10"
              placeholder="City, State"
            />
            <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
      </div>

      {formData.role === 'applicant' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
            <textarea
              value={formData.skills}
              onChange={(e) => handleInputChange('skills', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., React, Python, Machine Learning, UI/UX Design"
            />
            {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
            <input
              type="text"
              value={formData.qualifications}
              onChange={(e) => handleInputChange('qualifications', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., B.Tech CSE, MBA, Certification courses"
            />
            {errors.qualifications && <p className="text-red-500 text-sm mt-1">{errors.qualifications}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Social Category</label>
              <select
                value={formData.socialCategory}
                onChange={(e) => handleInputChange('socialCategory', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select Category</option>
                <option value="general">General</option>
                <option value="sc">SC</option>
                <option value="st">ST</option>
                <option value="obc">OBC</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isRural}
                  onChange={(e) => handleInputChange('isRural', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Rural Area</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isPwD}
                  onChange={(e) => handleInputChange('isPwD', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Person with Disability</span>
              </label>
            </div>
          </div>
        </>
      )}

      {formData.role === 'recruiter' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter company name"
            />
            {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => handleInputChange('designation', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Your designation/role"
            />
          </div>
        </>
      )}

      {(formData.role === 'mentor' || formData.role === 'admin') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
          <textarea
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Describe your relevant experience and expertise"
          />
        </div>
      )}
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Document Upload</h3>
        <p className="text-gray-600">Please upload the following documents for verification</p>
      </div>

      {formData.role === 'applicant' && (
        <div className="space-y-4">
          {[
            { key: 'marksMemo', label: 'Marks Memo/Transcript', required: true },
            { key: 'pan', label: 'PAN Card', required: true },
            { key: 'aadhaar', label: 'Aadhaar Card', required: true }
          ].map((doc) => (
            <div key={doc.key} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-700 mb-2">
                {doc.label} {doc.required && <span className="text-red-500">*</span>}
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(doc.key, e.target.files?.[0] || null)}
                className="hidden"
                id={doc.key}
              />
              <label
                htmlFor={doc.key}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                Choose File
              </label>
              {formData.documents[doc.key as keyof typeof formData.documents] && (
                <p className="text-green-600 text-sm mt-2">
                  ✓ {formData.documents[doc.key as keyof typeof formData.documents]?.name}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> All documents will be verified using OCR and government databases. 
          Please ensure documents are clear and readable.
        </p>
      </div>
    </motion.div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentMode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                {currentMode === 'register' && (
                  <div className="flex items-center space-x-2 mt-2">
                    {[1, 2, 3].map((stepNum) => (
                      <div
                        key={stepNum}
                        className={`w-8 h-2 rounded-full transition-all ${
                          step >= stepNum ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">Step {step} of 3</span>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {currentMode === 'login' || step === 1 ? renderStep1() : null}
                {currentMode === 'register' && step === 2 ? renderStep2() : null}
                {currentMode === 'register' && step === 3 ? renderStep3() : null}
              </AnimatePresence>

              {errors.submit && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{errors.submit}</p>
                </div>
              )}

              <div className="flex space-x-3 mt-8">
                {currentMode === 'register' && step > 1 && (
                  <motion.button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                  >
                    Back
                  </motion.button>
                )}
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  {currentMode === 'login'
                    ? 'Sign In'
                    : step === 3
                    ? 'Create Account'
                    : 'Continue'
                  }
                </motion.button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {currentMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={() => setCurrentMode(currentMode === 'login' ? 'register' : 'login')}
                  className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {currentMode === 'login' ? 'Register here' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}