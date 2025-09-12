import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { ArrowRight, Users, Building2, Award, TrendingUp, MapPin, Shield, Zap, Globe, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import { useState } from 'react';
import * as THREE from 'three';

// Animated 3D Globe Component
function AnimatedGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color="#3B82F6"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0.1}
        />
      </Sphere>
    </Float>
  );
}

// Animated Counter Component
function AnimatedCounter({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      let start = 0;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      
      return () => clearInterval(timer);
    }
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// Hero Video Background Component
function VideoBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/90 to-green-900/90 z-10" />
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0"
      >
        <div className="w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 opacity-20" />
      </motion.div>
    </div>
  );
}

// Floating Skill Bubbles
function SkillBubbles() {
  const skills = ['AI/ML', 'Web Dev', 'Data Science', 'Mobile Dev', 'DevOps', 'UI/UX', 'Blockchain', 'IoT'];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {skills.map((skill, index) => (
        <motion.div
          key={skill}
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
            opacity: 0
          }}
          animate={{
            y: -100,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 8 + index,
            repeat: Infinity,
            delay: index * 2,
            ease: "linear"
          }}
          className="absolute bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium border border-white/20"
        >
          {skill}
        </motion.div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<string>('');
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const openAuthModal = (mode: 'login' | 'register', role: string = '') => {
    setAuthMode(mode);
    setSelectedRole(role);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Award className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">PM Internship Portal</h1>
          </motion.div>
          
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openAuthModal('login')}
              className="px-6 py-2 text-white/90 hover:text-white transition-colors"
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openAuthModal('register')}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium"
            >
              Register
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <VideoBackground />
        <SkillBubbles />
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="text-white"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Transform India Through 
              <span className="block bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Smart Internships
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-white/80 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              AI-powered matching engine connecting talented students with industry leaders, 
              driving Digital India and Atmanirbhar Bharat initiatives through inclusive innovation.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openAuthModal('register', 'applicant')}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
              >
                <span>Apply for Internship</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openAuthModal('register', 'recruiter')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition-all"
              >
                Post Opportunities
              </motion.button>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-96"
          >
            <Canvas>
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} />
              <AnimatedGlobe />
            </Canvas>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section 
        style={{ y, opacity }}
        className="py-20 bg-white relative"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: 50000, suffix: '+', label: 'Students Registered' },
              { icon: Building2, value: 5000, suffix: '+', label: 'Companies Partnered' },
              { icon: Award, value: 25000, suffix: '+', label: 'Successful Matches' },
              { icon: TrendingUp, value: 95, suffix: '%', label: 'Success Rate' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-green-50 shadow-lg hover:shadow-xl transition-all group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all"
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Next-Gen AI Matching Engine
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leveraging advanced machine learning, blockchain transparency, and inclusive algorithms 
              to create perfect internship matches at scale.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'AI-Powered Matching',
                description: 'Sub-second matching using BERT embeddings, similarity search, and multi-criteria optimization',
                color: 'from-yellow-400 to-orange-500'
              },
              {
                icon: Shield,
                title: 'Blockchain Transparency',
                description: 'Immutable allocation records on Ethereum ensuring fairness and preventing manipulation',
                color: 'from-green-400 to-blue-500'
              },
              {
                icon: Globe,
                title: 'Inclusive by Design',
                description: 'Bias-free algorithms with affirmative action support for SC/ST/OBC, rural areas, and PwD candidates',
                color: 'from-purple-400 to-pink-500'
              },
              {
                icon: MapPin,
                title: 'Geospatial Analytics',
                description: 'Location-based matching with focus on aspirational districts and regional development',
                color: 'from-red-400 to-purple-500'
              },
              {
                icon: TrendingUp,
                title: 'Predictive Analytics',
                description: 'LSTM models forecasting internship demand and career progression paths',
                color: 'from-blue-400 to-green-500'
              },
              {
                icon: Star,
                title: 'Gamified Experience',
                description: 'Points, badges, and leaderboards to boost engagement and completion rates',
                color: 'from-orange-400 to-red-500'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-6 group-hover:shadow-lg transition-all`}
                >
                  <feature.icon className="h-7 w-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-based Registration Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four specialized roles designed to create a comprehensive ecosystem 
              of learning, mentorship, and opportunity.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                role: 'applicant',
                title: 'Student Applicant',
                description: 'Discover perfect internship matches, connect with mentors, track applications',
                icon: '🎓',
                color: 'from-blue-500 to-purple-600',
                features: ['AI Job Matching', 'Mentor Connect', 'Skill Assessment', 'Career Simulator']
              },
              {
                role: 'mentor',
                title: 'Industry Mentor',
                description: 'Guide students, share expertise, build the next generation workforce',
                icon: '🧑‍🏫',
                color: 'from-green-500 to-blue-600',
                features: ['Student Guidance', 'Expert Forums', 'Video Calls', 'Progress Tracking']
              },
              {
                role: 'recruiter',
                title: 'Company Recruiter',
                description: 'Find top talent, post opportunities, manage recruitment pipeline',
                icon: '🏢',
                color: 'from-orange-500 to-red-600',
                features: ['Talent Pool', 'Smart Screening', 'Compliance Tools', 'Analytics']
              },
              {
                role: 'admin',
                title: 'System Admin',
                description: 'Oversee operations, ensure fairness, generate insights and reports',
                icon: '⚙️',
                color: 'from-purple-500 to-pink-600',
                features: ['User Management', 'Matching Engine', 'Compliance', 'Analytics']
              }
            ].map((roleData, index) => (
              <motion.div
                key={roleData.role}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 group cursor-pointer"
                onClick={() => openAuthModal('register', roleData.role)}
              >
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">{roleData.icon}</div>
                  <div className={`w-16 h-1 bg-gradient-to-r ${roleData.color} rounded-full mx-auto mb-4`} />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{roleData.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{roleData.description}</p>
                </div>
                
                <div className="space-y-2 mb-6">
                  {roleData.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                      <div className={`w-2 h-2 bg-gradient-to-r ${roleData.color} rounded-full`} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 bg-gradient-to-r ${roleData.color} text-white rounded-lg font-semibold transition-all group-hover:shadow-lg`}
                >
                  Join as {roleData.title}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <Award className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold">PM Internship Portal</h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Empowering India's youth through AI-driven internship matching, 
              supporting Digital India and Atmanirbhar Bharat initiatives.
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
              <span>© 2024 Ministry of Corporate Affairs</span>
              <span>|</span>
              <span>Government of India</span>
              <span>|</span>
              <span>Smart India Hackathon</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        initialRole={selectedRole}
      />
    </div>
  );
}