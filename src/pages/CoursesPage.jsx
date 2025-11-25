/**
 * Courses Page Component
 * Lists all available courses with filtering
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Search, Filter, Loader, Plus, ArrowLeft } from 'lucide-react';

const CoursesPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isTeacher } = useAuth();
  
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const response = await courseAPI.getAll();
        
        if (response.success) {
          setCourses(response.data);
          setFilteredCourses(response.data);
        }
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Filter and search
  useEffect(() => {
    let filtered = courses;

    // Apply active filter
    if (filterActive === 'active') {
      filtered = filtered.filter(c => c.is_active);
    } else if (filterActive === 'inactive') {
      filtered = filtered.filter(c => !c.is_active);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredCourses(filtered);
  }, [searchTerm, filterActive, courses]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                  Courses
                </h1>
                <p className="text-gray-600 mt-1">{filteredCourses.length} courses available</p>
              </div>
            </div>

            {(isAdmin || isTeacher) && (
              <button
                onClick={() => navigate('/courses/create')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Course
              </button>
            )}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses by title, code, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Courses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'No courses available yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => navigate(`/courses/${course.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Course Card Component
const CourseCard = ({ course, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="flex items-start justify-between mb-2">
          <div className="bg-white p-3 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs bg-white text-blue-600 px-2 py-1 rounded font-semibold">
              {course.code}
            </span>
            {course.is_active ? (
              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                Active
              </span>
            ) : (
              <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded">
                Inactive
              </span>
            )}
          </div>
        </div>
        <h3 className="text-xl font-bold text-white">{course.title}</h3>
      </div>

      {/* Course Body */}
      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course.description || 'No description available'}
        </p>

        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Credits:</span>
            <span className="font-semibold text-gray-800">{course.credits}</span>
          </div>
          
          {course.teacher_name && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Teacher:</span>
              <span className="font-semibold text-gray-800">{course.teacher_name}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Created:</span>
            <span className="text-gray-800">
              {new Date(course.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default CoursesPage;
