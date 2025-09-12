import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Users, 
  Briefcase, 
  BarChart3,
  Shield,
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  Zap,
  Target,
  Map,
  Eye,
  Play
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { runMatching, updateMatchingProgress } from '../../redux/slices/matchingSlice';
import DashboardLayout from '../../components/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const systemStatsData = [
  { month: 'Jan', users: 1200, opportunities: 180, matches: 890 },
  { month: 'Feb', users: 1850, opportunities: 220, matches: 1450 },
  { month: 'Mar', users: 2400, opportunities: 280, matches: 2100 },
  { month: 'Apr', users: 3200, opportunities: 340, matches: 2850 },
  { month: 'May', users: 4100, opportunities: 420, matches: 3700 },
  { month: 'Jun', users: 5000, opportunities: 500, matches: 4500 },
];

const geographicData = [
  { state: 'Karnataka', users: 850, opportunities: 120, color: '#3B82F6' },
  { state: 'Maharashtra', users: 720, opportunities: 95, color: '#10B981' },
  { state: 'Tamil Nadu', users: 680, opportunities: 88, color: '#F59E0B' },
  { state: 'Telangana', users: 540, opportunities: 75, color: '#EF4444' },
  { state: 'Gujarat', users: 420, opportunities: 60, color: '#8B5CF6' },
];

const complianceMetrics = [
  { category: 'SC/ST Quota', target: 22.5, achieved: 24.1, status: 'good' },
  { category: 'OBC Quota', target: 27, achieved: 25.8, status: 'attention' },
  { category: 'PwD Inclusion', target: 4, achieved: 4.5, status: 'good' },
  { category: 'Rural Representation', target: 35, achieved: 38.2, status: 'excellent' },
  { category: 'Gender Balance', target: 33, achieved: 31.5, status: 'attention' },
];

export default function AdminDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { matchingProgress, batchMatching } = useSelector((state: RootState) => state.matching);
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRunningMatch, setIsRunningMatch] = useState(false);

  const totalUsers = 12500;
  const totalOpportunities = 850;
  const totalMatches = 9400;
  const systemUptime = '99.8%';

  const handleRunMatching = async () => {
    setIsRunningMatch(true);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      dispatch(updateMatchingProgress(Math.random() * 100));
    }, 500);

    try {
      await dispatch(runMatching({ batchSize: 1000 }));
    } finally {
      clearInterval(progressInterval);
      setIsRunningMatch(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 via-blue-600 to-green-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">System Control Center 🎛️</h2>
            <p className="text-purple-100">Managing {totalUsers.toLocaleString()} users across India</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{systemUptime}</div>
            <div className="text-sm text-purple-100">System Uptime</div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { icon: Users, label: 'Total Users', value: totalUsers.toLocaleString(), change: '+456', color: 'from-blue-500 to-blue-600' },
          { icon: Briefcase, label: 'Opportunities', value: totalOpportunities.toString(), change: '+23', color: 'from-green-500 to-green-600' },
          { icon: Target, label: 'Successful Matches', value: totalMatches.toLocaleString(), change: '+287', color: 'from-purple-500 to-purple-600' },
          { icon: TrendingUp, label: 'Success Rate', value: '92.3%', change: '+2.1%', color: 'from-orange-500 to-orange-600' },
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

      {/* System Health */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            {[
              { component: 'API Gateway', status: 'healthy', response: '45ms' },
              { component: 'ML Inference', status: 'healthy', response: '120ms' },
              { component: 'Database', status: 'healthy', response: '15ms' },
              { component: 'Cache Layer', status: 'warning', response: '85ms' },
              { component: 'File Storage', status: 'healthy', response: '30ms' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'healthy' ? 'bg-green-500' :
                    item.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm font-medium text-gray-900">{item.component}</span>
                </div>
                <span className="text-sm text-gray-600">{item.response}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Matching Engine</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Run</span>
              <span className="text-sm font-medium text-gray-900">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Processed</span>
              <span className="text-sm font-medium text-gray-900">2,847 profiles</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New Matches</span>
              <span className="text-sm font-medium text-green-600">287 matches</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Accuracy Score</span>
              <span className="text-sm font-medium text-purple-600">94.2%</span>
            </div>
            
            {batchMatching && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Matching Progress</span>
                  <span className="text-sm font-medium text-blue-600">{matchingProgress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${matchingProgress}%` }}
                  />
                </div>
              </div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRunMatching}
              disabled={isRunningMatch || batchMatching}
              className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>{isRunningMatch || batchMatching ? 'Running...' : 'Run Matching'}</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {[
              { type: 'success', message: 'Batch matching completed successfully', time: '2h ago' },
              { type: 'warning', message: 'Cache hit rate below 80%', time: '4h ago' },
              { type: 'info', message: 'New compliance report generated', time: '6h ago' },
              { type: 'success', message: '1000+ new user registrations today', time: '8h ago' },
            ].map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.type === 'success' ? 'bg-green-500' :
                  alert.type === 'warning' ? 'bg-yellow-500' :
                  alert.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={systemStatsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={3} />
              <Line type="monotone" dataKey="opportunities" stroke="#10B981" strokeWidth={3} />
              <Line type="monotone" dataKey="matches" stroke="#8B5CF6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={geographicData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Bar dataKey="users" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="opportunities" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Compliance & Fairness</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium flex items-center space-x-2"
        >
          <FileText className="h-5 w-5" />
          <span>Generate Report</span>
        </motion.button>
      </div>

      {/* Compliance Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complianceMetrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{metric.category}</h3>
              <div className={`w-3 h-3 rounded-full ${
                metric.status === 'excellent' ? 'bg-green-500' :
                metric.status === 'good' ? 'bg-blue-500' :
                metric.status === 'attention' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Target</span>
                <span className="font-medium text-gray-900">{metric.target}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Achieved</span>
                <span className={`font-medium ${
                  metric.achieved >= metric.target ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {metric.achieved}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    metric.achieved >= metric.target ? 'bg-green-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${Math.min((metric.achieved / metric.target) * 100, 100)}%` }}
                />
              </div>
              
              <p className={`text-xs ${
                metric.status === 'excellent' ? 'text-green-600' :
                metric.status === 'good' ? 'text-blue-600' :
                metric.status === 'attention' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {metric.status === 'excellent' ? 'Exceeding targets' :
                 metric.status === 'good' ? 'Meeting targets' :
                 metric.status === 'attention' ? 'Needs attention' : 'Below targets'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fairness Audit */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Bias Audit Results</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Matching Fairness Score</h4>
            <div className="space-y-3">
              {[
                { metric: 'Gender Bias', score: 0.92, threshold: 0.8 },
                { metric: 'Caste Bias', score: 0.89, threshold: 0.8 },
                { metric: 'Geographic Bias', score: 0.94, threshold: 0.8 },
                { metric: 'Educational Bias', score: 0.87, threshold: 0.8 },
              ].map((audit, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{audit.metric}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${audit.score >= audit.threshold ? 'text-green-600' : 'text-red-600'}`}>
                      {audit.score.toFixed(2)}
                    </span>
                    {audit.score >= audit.threshold ? 
                      <CheckCircle className="h-4 w-4 text-green-500" /> :
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
            <div className="space-y-2">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">✓ Gender representation is well balanced across all sectors</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">⚠ Consider increasing outreach to tier-3 cities for better geographic distribution</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">ℹ Educational bias within acceptable limits but monitor closely</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'System Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <DashboardLayout user={user} activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs}>
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'users' && renderOverview()} {/* Placeholder */}
      {activeTab === 'compliance' && renderCompliance()}
      {activeTab === 'analytics' && renderOverview()} {/* Placeholder */}
    </DashboardLayout>
  );
}