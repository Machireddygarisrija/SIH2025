import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Award,
  TrendingUp,
  Clock,
  Star,
  Video,
  FileText,
  Target,
  Heart,
  BookOpen
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import DashboardLayout from '../../components/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';

const mentorStatsData = [
  { month: 'Jan', mentees: 5, sessions: 20 },
  { month: 'Feb', mentees: 8, sessions: 35 },
  { month: 'Mar', mentees: 12, sessions: 48 },
  { month: 'Apr', mentees: 15, sessions: 65 },
  { month: 'May', mentees: 18, sessions: 72 },
  { month: 'Jun', mentees: 22, sessions: 88 },
];

const successRateData = [
  { category: 'Interview Success', rate: 85 },
  { category: 'Job Placements', rate: 78 },
  { category: 'Skill Improvement', rate: 92 },
  { category: 'Goal Achievement', rate: 88 },
];

const mockMentees = [
  {
    id: 1,
    name: 'Aditi Sharma',
    field: 'Full Stack Development',
    progress: 85,
    lastSession: '2 days ago',
    nextSession: 'Tomorrow 3:00 PM',
    goals: ['React Mastery', 'System Design', 'Interview Prep'],
    avatar: '👩‍💻',
    status: 'active'
  },
  {
    id: 2,
    name: 'Rohit Kumar',
    field: 'Data Science',
    progress: 70,
    lastSession: '1 week ago',
    nextSession: 'Friday 2:00 PM',
    goals: ['Machine Learning', 'Python Skills', 'Portfolio Building'],
    avatar: '👨‍💻',
    status: 'needs_attention'
  },
  {
    id: 3,
    name: 'Priya Patel',
    field: 'UI/UX Design',
    progress: 95,
    lastSession: 'Today',
    nextSession: 'Next Monday 4:00 PM',
    goals: ['Design Systems', 'User Research', 'Job Search'],
    avatar: '🎨',
    status: 'excellent'
  }
];

const forumTopics = [
  {
    id: 1,
    title: 'How to crack technical interviews in 2024',
    author: 'You',
    replies: 24,
    likes: 156,
    timeAgo: '2 hours ago',
    category: 'Interview Tips'
  },
  {
    id: 2,
    title: 'Building a portfolio that stands out',
    author: 'Mentor Sarah',
    replies: 18,
    likes: 89,
    timeAgo: '1 day ago',
    category: 'Career Advice'
  },
  {
    id: 3,
    title: 'Remote work best practices for freshers',
    author: 'Industry Expert',
    replies: 32,
    likes: 203,
    timeAgo: '3 days ago',
    category: 'Professional Tips'
  }
];

export default function MentorDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');

  const totalMentees = 22;
  const totalSessions = 156;
  const mentorRating = 4.9;
  const successRate = 88;

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Hello, Mentor {user?.name}! 🌟</h2>
            <p className="text-green-100">You're making a difference in {totalMentees} careers</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 mb-1">
              <Star className="h-6 w-6 text-yellow-300 fill-current" />
              <span className="text-2xl font-bold">{mentorRating}</span>
            </div>
            <div className="text-sm text-green-100">Mentor Rating</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { icon: Users, label: 'Active Mentees', value: totalMentees.toString(), change: '+3', color: 'from-blue-500 to-blue-600' },
          { icon: Calendar, label: 'Total Sessions', value: totalSessions.toString(), change: '+12', color: 'from-green-500 to-green-600' },
          { icon: TrendingUp, label: 'Success Rate', value: `${successRate}%`, change: '+5%', color: 'from-purple-500 to-purple-600' },
          { icon: Award, label: 'This Month', value: '18', change: '+6', color: 'from-orange-500 to-orange-600' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
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

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mentoring Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mentorStatsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Line type="monotone" dataKey="mentees" stroke="#10B981" strokeWidth={3} />
              <Line type="monotone" dataKey="sessions" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Metrics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={successRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Bar dataKey="rate" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );

  const renderMentees = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Mentees</h2>
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Schedule Session
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium"
          >
            Group Session
          </motion.button>
        </div>
      </div>

      <div className="grid gap-6">
        {mockMentees.map((mentee, index) => (
          <motion.div
            key={mentee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex space-x-4 flex-1">
                <div className="text-4xl">{mentee.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{mentee.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      mentee.status === 'excellent' ? 'bg-green-100 text-green-800' :
                      mentee.status === 'needs_attention' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {mentee.status === 'excellent' ? 'Excellent' : 
                       mentee.status === 'needs_attention' ? 'Needs Attention' : 'Active'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{mentee.field}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium text-gray-900">{mentee.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${mentee.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-2 rounded-full ${
                          mentee.progress >= 80 ? 'bg-green-500' :
                          mentee.progress >= 60 ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Last Session</p>
                      <p className="font-medium text-gray-900">{mentee.lastSession}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Next Session</p>
                      <p className="font-medium text-gray-900">{mentee.nextSession}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Current Goals</p>
                    <div className="flex flex-wrap gap-2">
                      {mentee.goals.map((goal, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 min-w-[120px]">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg text-sm font-medium flex items-center space-x-2"
                >
                  <Video className="h-4 w-4" />
                  <span>Video Call</span>
                </motion.button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Message</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Notes</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCommunity = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Community Forum</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium"
        >
          New Topic
        </motion.button>
      </div>

      <div className="grid gap-4">
        {forumTopics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    {topic.category}
                  </span>
                  <span className="text-sm text-gray-500">{topic.timeAgo}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-gray-600 text-sm">by {topic.author}</p>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{topic.replies}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>{topic.likes}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips & Resources</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Weekly Career Insights</p>
                <p className="text-sm text-gray-600">Share industry trends and job market updates</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Target className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Goal Setting Framework</p>
                <p className="text-sm text-gray-600">Help mentees set and achieve SMART goals</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Time Management Tips</p>
                <p className="text-sm text-gray-600">Productivity strategies for new professionals</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Star className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Success Stories</p>
                <p className="text-sm text-gray-600">Celebrate mentee achievements and milestones</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'mentees', label: 'My Mentees', icon: Users },
    { id: 'community', label: 'Community', icon: MessageCircle },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <DashboardLayout user={user} activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs}>
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'mentees' && renderMentees()}
      {activeTab === 'community' && renderCommunity()}
      {activeTab === 'analytics' && renderOverview()} {/* Reusing overview for analytics */}
    </DashboardLayout>
  );
}