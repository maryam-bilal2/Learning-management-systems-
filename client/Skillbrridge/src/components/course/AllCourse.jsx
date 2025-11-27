
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, ChevronDown, Loader } from 'lucide-react';
import { getAllCourses } from '../../Api/courseApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import CourseCard from './CourseCard.jsx';

const AllCourse = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch courses from API and ensure fresh data
      const response = await getAllCourses();

      // Handle both formats: array directly or { success, courses }
      const coursesData = Array.isArray(response)
        ? response
        : response?.success
        ? response.courses
        : [];

      if (!coursesData || coursesData.length === 0) {
        setError('No courses found.');
      }

      setCourses(coursesData || []);
    } catch (err) {
      console.error('Fetch courses error:', err);
      setError(err?.message || 'Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  const getUniqueCategories = () =>
    [...new Set(courses.map(c => c.category).filter(Boolean))];

  const filteredCourses = courses.filter(c => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      c.title?.toLowerCase().includes(search) ||
      c.description?.toLowerCase().includes(search) ||
      c.educator?.name?.toLowerCase().includes(search);

    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesLevel =
      selectedLevel === 'all' ||
      c.level === selectedLevel ||
      c.difficulty === selectedLevel;

    let matchesPrice = true;
    if (priceRange === 'free') matchesPrice = c.price === 0;
    else if (priceRange === 'paid') matchesPrice = c.price > 0;
    else if (priceRange === 'under50') matchesPrice = c.price > 0 && c.price <= 50;
    else if (priceRange === 'over50') matchesPrice = c.price > 50;

    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      case 'students': return (b.enrolledStudents?.length || 0) - (a.enrolledStudents?.length || 0);
      case 'title': return a.title.localeCompare(b.title);
      default: return 0;
    }
  });

  const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };
  const stagger = { animate: { transition: { staggerChildren: 0.1 } } };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="text-center">
        <Loader className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
        <h3 className="text-xl font-semibold text-white mb-2">Loading Courses</h3>
        <p className="text-slate-400">Please wait while we fetch the latest courses...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 pt-24">
      <div className="container mx-auto px-6 lg:px-8 pb-16">

        {/* Header */}
        <motion.div {...fadeInUp} className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Courses</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Discover thousands of courses from expert instructors and advance your skills
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-slate-300">
            {[{
              label: 'Total Courses', value: courses.length, color: 'text-blue-400'
            },{
              label: 'Categories', value: getUniqueCategories().length, color: 'text-purple-400'
            },{
              label: 'Students Enrolled', value: courses.reduce((a, c) => a + (c.enrolledStudents?.length || 0), 0), color: 'text-green-400'
            }].map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div {...fadeInUp} className="p-6 mb-8 border border-slate-700/50 bg-slate-800/50 rounded-2xl backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row gap-4 items-center mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses, instructors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:(border-blue-500 ring-2 ring-blue-500/20) outline-none transition-all duration-300"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 text-slate-300 hover:bg-slate-600 transition"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-600"
            >
              {[{
                label: 'Category', value: selectedCategory, setter: setSelectedCategory, options: ['all', ...getUniqueCategories()]
              },{
                label: 'Level', value: selectedLevel, setter: setSelectedLevel, options: ['all','beginner','intermediate','advanced']
              },{
                label: 'Price', value: priceRange, setter: setPriceRange, options: ['all','free','paid','under50','over50']
              },{
                label: 'Sort By', value: sortBy, setter: setSortBy, options: ['newest','oldest','price-low','price-high','rating','students','title']
              }].map((filter, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-slate-300 mb-2">{filter.label}</label>
                  <select
                    value={filter.value}
                    onChange={(e) => filter.setter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:border-blue-500 outline-none"
                  >
                    {filter.options.map(opt => (
                      <option key={opt} value={opt}>
                        {opt === 'all' ? `All ${filter.label}s` : opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div {...fadeInUp} className="p-6 mb-8 border border-red-600/20 rounded-xl bg-red-600/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-600/20 shrink-0">
                <BookOpen className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-300 mb-1">Error Loading Courses</h3>
                <p className="text-red-400 text-sm">{error}</p>
                <button
                  onClick={fetchCourses}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            <motion.div {...fadeInUp} className="flex justify-between items-center mb-8 text-slate-400">
              <div>
                Showing {sortedCourses.length} of {courses.length} courses
                {(searchTerm || selectedCategory !== 'all' || selectedLevel !== 'all' || priceRange !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm(''); setSelectedCategory('all'); setSelectedLevel('all'); setPriceRange('all');
                    }}
                    className="ml-2 text-blue-400 hover:text-blue-300 underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </motion.div>

            <motion.div {...stagger} className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedCourses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllCourse;
