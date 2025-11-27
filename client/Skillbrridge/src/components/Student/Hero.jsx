import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { 
  Play,
  ArrowRight,
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Search,
  ChevronDown,
  Star,
  Clock,
  Zap,
  Target,
  Trophy
} from 'lucide-react';

// import { getAllCourses } from '../../Api/courseApi.js';
import { useAuth } from '../../context/AuthContext.jsx';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const controls = useAnimation();

  // State for dynamic content
  const [heroStats, setHeroStats] = useState({
    totalCourses: 50,
    totalStudents: 900,
    totalInstructors: 150,
    averageRating: 4.8
  });
  const [currentTypewriterText, setCurrentTypewriterText] = useState(0);
  const [typewriterDisplay, setTypewriterDisplay] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Typewriter effect texts
  const typewriterTexts = [
    "Web Development",
    "App Development",
    "Artificial Intelligence",
    "Machine Learning",
    "Data Science",
    "Cybersecurity",
    "Cloud Computing",
  ];

  useEffect(() => {
    startTypewriterEffect();
  }, []);

  const startTypewriterEffect = () => {
    let currentIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    const typeWriter = () => {
      const currentText = typewriterTexts[currentIndex];

      if (isDeleting) {
        setTypewriterDisplay(currentText.substring(0, currentCharIndex - 1));
        currentCharIndex--;

        if (currentCharIndex === 0) {
          isDeleting = false;
          currentIndex = (currentIndex + 1) % typewriterTexts.length;
          setTimeout(typeWriter, 800);
          return;
        }
      } else {
        setTypewriterDisplay(currentText.substring(0, currentCharIndex + 1));
        currentCharIndex++;

        if (currentCharIndex === currentText.length) {
          isDeleting = true;
          setTimeout(typeWriter, 3000);
          return;
        }
      }

      setTimeout(typeWriter, isDeleting ? 80 : 150);
    };

    typeWriter();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/course?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/course');
    } else {
      navigate('/login');
    }
  };

  return (
    <motion.div 
      className="relative min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-center lg:justify-between z-10">
        {/* Main Hero Content */}
        <motion.div 
          className="space-y-6 md:space-y-8 text-center lg:text-left w-full lg:w-1/2"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <motion.h1 
            className="text-2xl sm:text-3xl md:text-5xl lg:text-4xl xl:text-6xl font-bold leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent block mb-2">
              Master New Skills in{' '}
            </span>
            <motion.span 
              className="bg-linear-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent inline-block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {typewriterDisplay}
              <motion.span
                className="inline-block w-0.5 h-6 sm:h-8 md:h-10 lg:h-12 bg-blue-400 ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.span>
          </motion.h1>

          <motion.p 
            className="text-base sm:text-lg md:text-xl lg:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Powerful Features for Modern Learning with cutting-edge technology and expert instructors. 
            Build real skills that advance your career with our comprehensive courses.
          </motion.p>

          {/* Stats Section */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 sm:p-4 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300 group">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300 mx-auto lg:mx-0" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{heroStats.totalCourses.toLocaleString()}+</div>
              <div className="text-xs sm:text-sm text-slate-400">Courses</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 sm:p-4 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300 group">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mb-2 group-hover:scale-110 transition-transform duration-300 mx-auto lg:mx-0" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{heroStats.totalStudents.toLocaleString()}+</div>
              <div className="text-xs sm:text-sm text-slate-400">Students</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 sm:p-4 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300 group">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mb-2 group-hover:scale-110 transition-transform duration-300 mx-auto lg:mx-0" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{heroStats.totalInstructors.toLocaleString()}+</div>
              <div className="text-xs sm:text-sm text-slate-400">Instructors</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 sm:p-4 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300 group">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-300 mx-auto lg:mx-0" />
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{heroStats.averageRating}</div>
              <div className="text-xs sm:text-sm text-slate-400">Avg Rating</div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.form 
            className="max-w-md mx-auto lg:mx-0 w-full"
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full p-1 hover:border-slate-600/50 focus-within:border-blue-500/50 transition-all duration-300">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 z-10" />
              <input
                type="text"
                placeholder="What do you want to learn today?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-16 sm:pr-20 py-2.5 sm:py-3 bg-transparent border-none outline-none text-white placeholder-slate-400 text-sm sm:text-base"
              />
              <motion.button 
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full p-1.5 sm:p-2 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </motion.button>
            </div>
          </motion.form>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <motion.button 
              className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              {user ? 'Browse Courses' : 'Get Started'}
            </motion.button>
            
            <motion.button 
              className="flex items-center justify-center gap-2 bg-transparent border-2 border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/50 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 w-full sm:w-auto"
              onClick={() => navigate('/about')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <motion.div 
          className="absolute w-72 h-72 bg-blue-500/5 rounded-full top-[20%] left-[10%] blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute w-48 h-48 bg-purple-500/5 rounded-full bottom-[20%] right-[15%] blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.05, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute w-96 h-96 bg-slate-500/3 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-3xl"
          animate={{ scale: [1, 1.5, 1], opacity: [0.03, 0.1, 0.03] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 text-slate-400 text-xs sm:text-sm flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="hidden sm:inline">Explore More</span>
        <span className="sm:hidden">More</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Hero;
