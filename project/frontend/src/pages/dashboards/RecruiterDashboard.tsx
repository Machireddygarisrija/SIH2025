import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  Eye, 
  FileText,
  Plus,
  Filter,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import DashboardLayout from '../../components/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const applicationTrendsData = [
  { month: 'Jan', applications: 45, hired: 8 },
  { month: 'Feb', applications: 52, hired: 12 },
  { month: 'Mar', applications: 68, hired: 15 },
  { month: 'Apr', applications: 78, hired: 18 },
  { month: 'May', applications: 95, hired: 22 },
  { month: 'Jun', applications: 112, hired: 28 },
];

const diversityData = [
  { name: 'General', value: 45, color: '#3B82F6' },
  { name: 'OBC', value: 27, color: '#10B981' },
  { name: 'SC', value: 15, color: '#F59E0B' },
  { name: 'ST', value: 8, color: '#EF4444' },
  { name: 'PwD', value: 5, color: '#8B5CF6' },
];

const mockOpportunities = [
  {
    id: 1,
    title: 'Full Stack Developer Intern',
    department: 'Engineering',
    applicants: 124,
    shortlisted: 18,
    hired: 3,
    postedDate: '2024-01-15',
    deadline: '2024-02-15',
    status: 'active',
    stipend: '₹25,000/month',
    duration: '6 months',
    skills: ['React', 'Node.js', 'MongoDB'],
    location: 'Bangalore'
  },
  {
    id: 2,
    title: 'Data Science Intern',
    department: 'Analytics',
    applicants: 89,
    shortlisted: 12,
    hired: 2,
    postedDate: '2024-01-20',
    deadline: '2024-02-20',
    status: 'active',
    stipend: '₹30,000/month',
    duration: '4 months',
    skills: ['Python', 'ML', 'SQL'],
    location: 'Hyderabad'
  },
  {
    id: 3,
    title: 'UI/UX Design Intern',
    department: 'Design',
    applicants: 67,
    shortlisted: 15,
    hired: 4,
    postedDate: '2024-01-10',
    deadline: '2024-01-30',
    status: 'closed',
    stipend: '₹20,000/month',
    duration: '3 months',
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    location: 'Mumbai'
  }
];

const mockCandidates = [
  {
    id: 1,
    name: 'Rahul Sharma',
    role: 'Full Stack Developer',
    matchScore: 95,
    skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
    experience: 'Fresh Graduate',
    location: 'Bangalore',
    education: 'B.Tech CSE - IIT Delhi',
    status: 'shortlisted',
    appliedDate: '2024-01-16',
    avatar: '👨‍💻',
    socialCategory: 'General',
    isRural: false
  },
  {
    id: 2,
    name: 'Priya Patel',
    role: 'Data Science Intern',
    matchScore: 92,
    skills: ['Python', 'Machine Learning', 'SQL', 'Pandas'],
    experience: 'Final Year Student',
    location: 'Ahmedabad',
    education: 'B.Tech IT - NIT Surat',
    status: 'under_review',
    appliedDate: '2024-01-18',
    avatar: '👩‍💻',
    socialCategory: 'OBC',
    isRural: true
  },
  {
    id: 3,
    name: 'Arjun Singh',
    role: 'UI/UX Designer',
    matchScore: 88,
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
    experience: '1 Year Freelance',
    location: 'Jaipur',
    education: 'B.Des - NIFT Delhi',
    status: 'interview_scheduled',
    appliedDate: '2024-01-12',
    avatar: '🎨',
    socialCategory: 'SC',
    isRural: false
  }
];

export default function RecruiterDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpportunity, setSelectedOpportunity] = useState<string>('all');

  const totalOpportunities = 15;
  const totalApplications = 456;
  const shortlistedCandidates = 78;
  const hiredInterns = 23;

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome, {user?.name}! 🚀</h2>
            <p className="text-orange-100">Building the future workforce with {totalApplications} applications</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{hiredInterns}</div>
            <div className="text-sm text-orange-100">Successful Hires</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { icon: Briefcase, label: 'Active Opportunities', value: totalOpportunities.toString(), change: '+3', color: 'from-blue-500 to-blue-600' },
          { icon: Users, label: 'Total Applications', value: totalApplications.toString(), change: '+45', color: 'from-green-500 to-green-600' },
          { icon: Eye, label: 'Shortlisted', value: shortlistedCandidates.toString(), change: '+12', color: 'from-purple-500 to-purple-600' },
          { icon: CheckCircle, label: 'Hired', value: hiredInterns.toString(), change: '+5', color: 'from-orange-500 to-orange-600' },
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={applicationTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Bar dataKey="applications" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="hired" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Diversity Metrics</h3>
          <div className="flex items-center">
            <div className="h-64 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={diversityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {diversityData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 ml-4">
              {diversityData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-gray-700">{entry.name}: {entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { type: 'application', message: 'New application from Rahul Sharma for Full Stack Developer position', time: '2 hours ago' },
            { type: 'shortlist', message: 'Priya Patel shortlisted for Data Science Intern role', time: '4 hours ago' },
            { type: 'hire', message: 'Successfully hired 2 interns for UI/UX Design positions', time: '1 day ago' },
            { type: 'post', message: 'New opportunity "Mobile App Developer" posted', time: '2 days ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === 'application' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'shortlist' ? 'bg-purple-100 text-purple-600' :
                activity.type === 'hire' ? 'bg-green-100 text-green-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                {activity.type === 'application' && <Users className="h-4 w-4" />}
                {activity.type === 'shortlist' && <Eye className="h-4 w-4" />}
                {activity.type === 'hire' && <CheckCircle className="h-4 w-4" />}
                {activity.type === 'post' && <Plus className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderOpportunities = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Opportunities</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-medium flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Post New Opportunity</span>
        </motion.button>
      </div>

      <div className="grid gap-6">
        {mockOpportunities.map((opportunity, index) => (
          <motion.div
            key={opportunity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{opportunity.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    opportunity.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {opportunity.status === 'active' ? 'Active' : 'Closed'}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{opportunity.department} • {opportunity.location}</p>
                
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Applications</p>
                    <p className="text-2xl font-bold text-blue-600">{opportunity.applicants}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Shortlisted</p>
                    <p className="text-2xl font-bold text-purple-600">{opportunity.shortlisted}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hired</p>
                    <p className="text-2xl font-bold text-green-600">{opportunity.hired}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Conversion</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {((opportunity.hired / opportunity.applicants) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{opportunity.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium text-green-600">{opportunity.stipend}</span>
                  </div>
                  <div>
                    Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {opportunity.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 min-w-[140px]">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium"
                >
                  View Applications
                </motion.button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Edit Posting
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Analytics
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCandidates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Candidate Applications</h2>
        <div className="flex space-x-3">
          <select 
            value={selectedOpportunity}
            onChange={(e) => setSelectedOpportunity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Opportunities</option>
            <option value="1">Full Stack Developer</option>
            <option value="2">Data Science Intern</option>
            <option value="3">UI/UX Designer</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </motion.button>
        </div>
      </div>

      <div className="grid gap-6">
        {mockCandidates.map((candidate, index) => (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex space-x-4 flex-1">
                <div className="text-4xl">{candidate.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium text-gray-900">{candidate.matchScore}%</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      candidate.status === 'shortlisted' ? 'bg-purple-100 text-purple-800' :
                      candidate.status === 'interview_scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {candidate.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-1">{candidate.role}</p>
                  <p className="text-sm text-gray-500 mb-3">{candidate.education}</p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500">Experience</p>
                      <p className="font-medium text-gray-900">{candidate.experience}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Location</p>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="font-medium text-gray-900">{candidate.location}</span>
                        {candidate.isRural && <span className="text-xs text-green-600">(Rural)</span>}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">Category</p>
                      <p className="font-medium text-gray-900">{candidate.socialCategory}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">Applied on {new Date(candidate.appliedDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 min-w-[140px]">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg text-sm font-medium"
                >
                  Shortlist
                </motion.button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  View Profile
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Schedule Interview
                </button>
                <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg text-sm hover:bg-red-50 transition-colors">
                  Reject
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <DashboardLayout user={user} activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs}>
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'opportunities' && renderOpportunities()}
      {activeTab === 'candidates' && renderCandidates()}
      {activeTab === 'analytics' && renderOverview()} {/* Reusing overview for analytics */}
    </DashboardLayout>
  );
}