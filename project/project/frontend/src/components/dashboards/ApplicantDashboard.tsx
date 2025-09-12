import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  Users, 
  Award, 
  TrendingUp, 
  MapPin, 
  Clock, 
  Star,
  Eye,
  MessageCircle,
  FileText,
  Target,
  Zap,
  Trophy,
  VrIcon,
  Mic,
  MicOff
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import DashboardLayout from '../DashboardLayout';
import ARPreview from '../ar/ARPreview';
import BlockchainVerification from '../blockchain/BlockchainVerification';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const skillProgressData = [
  { month: 'Jan', progress: 20 },
  { month: 'Feb', progress: 35 },
  { month: 'Mar', progress: 45 },
  { month: 'Apr', progress: 60 },
  { month: 'May', progress: 75 },
  { month: 'Jun', progress: 90 },
];

const applicationStatusData = [
  { name: 'Applied', value: 8, color: '#3B82F6' },
  { name: 'Under Review', value: 5, color: '#F59E0B' },
  { name: 'Shortlisted', value: 3, color: '#10B981' },
  { name: 'Rejected', value: 2, color: '#EF4444' },
];

const mockOpportunities = [
  {
    id: 1,
    title: 'Full Stack Developer Intern',
    company: 'TechCorp India',
    location: 'Bangalore, Karnataka',
    matchScore: 95,
    skills: ['React', 'Node.js', 'MongoDB'],
    duration: '6 months',
    stipend: '₹25,000/month',
    logo: '🚀',
    isNew: true,
    hasAR: true,
    description: 'Work on cutting-edge web applications using modern technologies.',
    images: ['office1.jpg', 'office2.jpg']
  },
  {
    id: 2,
    title: 'AI/ML Research Intern',
    company: 'DataScience Labs',
    location: 'Hyderabad, Telangana',
    matchScore: 88,
    skills: ['Python', 'TensorFlow', 'Data Analysis'],
    duration: '4 months',
    stipend: '₹30,000/month',
    logo: '🤖',
    isNew: false,
    hasAR: true,
    description: 'Research and develop machine learning models for real-world applications.',
    images: ['lab1.jpg', 'lab2.jpg']
  },
  {
    id: 3,
    title: 'UI/UX Design Intern',
    company: 'Creative Studio',
    location: 'Mumbai, Maharashtra',
    matchScore: 82,
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    duration: '3 months',
    stipend: '₹20,000/month',
    logo: '🎨',
    isNew: true,
    hasAR: false,
    description: 'Design beautiful and intuitive user interfaces for mobile and web applications.',
    images: ['studio1.jpg', 'studio2.jpg']
  }
];

const mockMentors = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    designation: 'Senior Software Engineer',
    company: 'Google India',
    expertise: ['Full Stack Development', 'System Design'],
    matchScore: 92,
    rating: 4.8,
    sessions: 150,
    photo: '👩‍💻'
  },
  {
    id: 2,
    name: 'Raj Kumar',
    designation: 'Data Science Lead',
    company: 'Microsoft',
    expertise: ['Machine Learning', 'Data Analytics'],
    matchScore: 87,
    rating: 4.9,
    sessions: 200,
    photo: '👨‍💼'
  }
];

export default function ApplicantDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAROpportunity, setSelectedAROpportunity] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');

  const profileCompletion = 85;
  const totalPoints = 2450;
  const currentBadges = ['Profile Pro', 'Quick Learner', 'Network Builder'];

  // Voice interface
  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceQuery(transcript);
        handleVoiceCommand(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('show opportunities') || lowerCommand.includes('find internships')) {
      setActiveTab('opportunities');
    } else if (lowerCommand.includes('show mentors') || lowerCommand.includes('find mentors')) {
      setActiveTab('mentors');
    } else if (lowerCommand.includes('show achievements') || lowerCommand.includes('my badges')) {
      setActiveTab('gamification');
    } else if (lowerCommand.includes('overview') || lowerCommand.includes('dashboard')) {
      setActiveTab('overview');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section with Voice Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 rounded-xl p-6 text-white relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}! 👋</h2>
            <p className="text-blue-100">Ready to discover your next opportunity?</p>
            {voiceQuery && (
              <p className="text-sm text-blue-200 mt-2">Voice: "{voiceQuery}"</p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={startVoiceRecognition}
              className={`p-3 rounded-full transition-all ${
                isListening 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-white/20 hover:bg-white/30'
              }`}
              title="Voice commands"
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>
            <div className="text-right">
              <div className="text-3xl font-bold">{totalPoints}</div>
              <div className="text-sm text-blue-100">Points Earned</div>
            </div>
          </div>
        </div>
        
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              animate={{
                x: [0, Math.random() * 400],
                y: [0, Math.random() * 200],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { icon: Briefcase, label: 'Applications', value: '18', change: '+3', color: 'from-blue-500 to-blue-600' },
          { icon: Eye, label: 'Profile Views', value: '47', change: '+12', color: 'from-green-500 to-green-600' },
          { icon: Users, label: 'Mentors', value: '3', change: '+1', color: 'from-purple-500 to-purple-600' },
          { icon: Trophy, label: 'Badges', value: '5', change: '+2', color: 'from-orange-500 to-orange-600' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 cursor-pointer"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-green-600 text-sm font-medium">{stat.change}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Profile Completion & Skills Progress */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Overall Progress</span>
              <span className="text-blue-600 font-medium">{profileCompletion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${profileCompletion}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            {[
              { task: 'Upload Documents', completed: true },
              { task: 'Complete Skills Assessment', completed: true },
              { task: 'Add Portfolio Projects', completed: false },
              { task: 'Write About Section', completed: false },
            ].map((task, index) => (
              <motion.div 
                key={index} 
                className="flex items-center space-x-3"
                whileHover={{ x: 5 }}
              >
                <div className={`w-4 h-4 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={`text-sm ${task.completed ? 'text-gray-900' : 'text-gray-500'}`}>{task.task}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Progress</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={skillProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Area 
                type="monotone" 
                dataKey="progress" 
                stroke="#3B82F6" 
                fill="url(#colorGradient)" 
                strokeWidth={3}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Application Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={applicationStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {applicationStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {applicationStatusData.map((status, index) => (
              <motion.div 
                key={index} 
                className="flex items-center justify-between"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: status.color }} />
                  <span className="text-gray-700">{status.name}</span>
                </div>
                <span className="font-medium text-gray-900">{status.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderOpportunities = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Recommended Opportunities</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium"
        >
          View All
        </motion.button>
      </div>

      <div className="grid gap-6">
        {mockOpportunities.map((opportunity, index) => (
          <motion.div
            key={opportunity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex space-x-4 flex-1">
                <div className="text-4xl">{opportunity.logo}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{opportunity.title}</h3>
                    {opportunity.isNew && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        New
                      </span>
                    )}
                    {opportunity.hasAR && (
                      <button
                        onClick={() => setSelectedAROpportunity(opportunity)}
                        className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium hover:bg-purple-200 transition-colors flex items-center space-x-1"
                      >
                        <VrIcon className="h-3 w-3" />
                        <span>AR Preview</span>
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{opportunity.company}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{opportunity.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{opportunity.duration}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {opportunity.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="text-lg font-bold text-gray-900">{opportunity.matchScore}%</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">Match Score</p>
                <p className="text-lg font-semibold text-green-600 mb-4">{opportunity.stipend}</p>
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium"
                  >
                    Apply Now
                  </motion.button>
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AR Preview Modal */}
      {selectedAROpportunity && (
        <ARPreview
          isOpen={!!selectedAROpportunity}
          onClose={() => setSelectedAROpportunity(null)}
          opportunityData={selectedAROpportunity}
        />
      )}
    </div>
  );

  const renderMentors = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Connect with Mentors</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium"
        >
          Browse All
        </motion.button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {mockMentors.map((mentor, index) => (
          <motion.div
            key={mentor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
          >
            <div className="flex items-start space-x-4">
              <div className="text-5xl">{mentor.photo}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{mentor.name}</h3>
                <p className="text-gray-600 mb-1">{mentor.designation}</p>
                <p className="text-sm text-gray-500 mb-3">{mentor.company}</p>
                
                <div className="flex items-center space-x-4 mb-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span>{mentor.rating}</span>
                  </div>
                  <div className="text-gray-500">{mentor.sessions} sessions</div>
                  <div className="text-green-600 font-medium">{mentor.matchScore}% match</div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.expertise.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg text-sm font-medium"
                  >
                    Connect
                  </motion.button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderGamification = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-xl text-white transform-gpu"
        >
          <Trophy className="h-12 w-12 mb-4" />
          <h3 className="text-2xl font-bold mb-2">{totalPoints}</h3>
          <p className="text-yellow-100">Total Points</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-xl text-white transform-gpu"
        >
          <Award className="h-12 w-12 mb-4" />
          <h3 className="text-2xl font-bold mb-2">{currentBadges.length}</h3>
          <p className="text-purple-100">Badges Earned</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="bg-gradient-to-br from-green-500 to-teal-600 p-6 rounded-xl text-white transform-gpu"
        >
          <TrendingUp className="h-12 w-12 mb-4" />
          <h3 className="text-2xl font-bold mb-2">#12</h3>
          <p className="text-green-100">Leaderboard Rank</p>
        </motion.div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Badges</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Profile Pro', description: 'Complete 100% profile', color: 'from-blue-500 to-blue-600', earned: true },
              { name: 'Quick Learner', description: 'Complete 5 skill assessments', color: 'from-green-500 to-green-600', earned: true },
              { name: 'Network Builder', description: 'Connect with 3+ mentors', color: 'from-purple-500 to-purple-600', earned: true },
              { name: 'Interview Ace', description: 'Pass 10 interviews', color: 'from-orange-500 to-orange-600', earned: false },
            ].map((badge, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, rotateY: 10 }}
                className={`p-4 rounded-lg border-2 transform-gpu ${badge.earned ? 'border-transparent' : 'border-dashed border-gray-300'}`}
                style={badge.earned ? {
                  background: `linear-gradient(135deg, ${badge.color.split(' ')[1]} 0%, ${badge.color.split(' ')[3]} 100%)`
                } : {}}
              >
                <div className={`w-10 h-10 rounded-full mb-3 flex items-center justify-center ${badge.earned ? 'bg-white/20' : 'bg-gray-200'}`}>
                  <Award className={`h-5 w-5 ${badge.earned ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <h4 className={`font-semibold mb-1 ${badge.earned ? 'text-white' : 'text-gray-500'}`}>
                  {badge.name}
                </h4>
                <p className={`text-xs ${badge.earned ? 'text-white/80' : 'text-gray-400'}`}>
                  {badge.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leaderboard</h3>
          <div className="space-y-3">
            {[
              { rank: 1, name: 'Arjun Patel', points: 3850, avatar: '🏆' },
              { rank: 2, name: 'Shreya Gupta', points: 3620, avatar: '🥈' },
              { rank: 3, name: 'Vikram Singh', points: 3200, avatar: '🥉' },
              { rank: 12, name: 'You', points: totalPoints, avatar: '👤', isMe: true },
            ].map((user, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, x: 5 }}
                className={`flex items-center justify-between p-3 rounded-lg ${user.isMe ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-lg">{user.avatar}</div>
                  <div>
                    <p className={`font-medium ${user.isMe ? 'text-blue-900' : 'text-gray-900'}`}>
                      #{user.rank} {user.name}
                    </p>
                  </div>
                </div>
                <div className={`font-bold ${user.isMe ? 'text-blue-600' : 'text-gray-600'}`}>
                  {user.points.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Blockchain Verification Section */}
      <BlockchainVerification
        allocationId="sample-allocation-123"
        applicantId={user?.id || 'user-123'}
        opportunityId="opportunity-456"
        matchScore={95}
      />
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'mentors', label: 'Mentors', icon: Users },
    { id: 'gamification', label: 'Achievements', icon: Trophy },
  ];

  return (
    <DashboardLayout user={user} activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs}>
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'opportunities' && renderOpportunities()}
      {activeTab === 'mentors' && renderMentors()}
      {activeTab === 'gamification' && renderGamification()}
    </DashboardLayout>
  );
}