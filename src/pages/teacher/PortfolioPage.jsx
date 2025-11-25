/**
 * Teacher Portfolio Page (INNOVATIVE)
 * Professional teaching portfolio with achievements, publications, training
 */

import { useState } from 'react';
import { Award, BookOpen, Users, TrendingUp, Calendar, Plus, Edit, Download, Share2, Trophy, Star, Target } from 'lucide-react';

const TeacherPortfolioPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const portfolio = {
    overview: {
      yearsExperience: 8,
      studentsCount: 450,
      avgSatisfaction: 4.7,
      coursesCount: 12,
    },
    achievements: [
      { id: 1, title: 'Meilleur Professeur 2023', date: '2023-06-15', org: 'Ministère de l\'Éducation', type: 'award' },
      { id: 2, title: 'Innovation Pédagogique', date: '2023-03-20', org: 'UNESCO', type: 'recognition' },
      { id: 3, title: 'Formation Montessori', date: '2022-11-10', org: 'AMI', type: 'certification' },
    ],
    publications: [
      { id: 1, title: 'Enseigner les mathématiques à l\'ère numérique', type: 'Article', journal: 'Revue Pédagogique', year: 2023, citations: 12 },
      { id: 2, title: 'Méthodes actives en classe inversée', type: 'Livre', publisher: 'Éditions Scolaires', year: 2022, isbn: '978-2-1234-5678-9' },
    ],
    training: [
      { id: 1, title: 'Gestion de classe moderne', provider: 'Formation Continue', duration: '40h', date: '2023-09-01', status: 'completed' },
      { id: 2, title: 'Pédagogie différenciée', provider: 'IFADEM', duration: '30h', date: '2023-05-15', status: 'completed' },
      { id: 3, title: 'Numérique éducatif', provider: 'EdTech Haiti', duration: '20h', date: 'En cours', status: 'ongoing' },
    ],
    projects: [
      { id: 1, name: 'Club de Mathématiques', role: 'Fondateur', students: 25, year: '2022-2024', impact: 'Participation à 3 olympiades nationales' },
      { id: 2, name: 'Tutorat en ligne', role: 'Coordinateur', students: 50, year: '2023-2024', impact: '+15% de réussite aux examens' },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mon Portfolio</h1>
          <p className="text-gray-500">Votre parcours professionnel et réalisations</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border text-gray-700 rounded-lg hover:bg-gray-50">
            <Share2 className="w-4 h-4" />
            Partager
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Exporter PDF
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-6 text-white">
          <Calendar className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-3xl font-bold">{portfolio.overview.yearsExperience}</p>
          <p className="text-blue-100 text-sm">Années d'expérience</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white">
          <Users className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-3xl font-bold">{portfolio.overview.studentsCount}</p>
          <p className="text-green-100 text-sm">Étudiants formés</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
          <Star className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-3xl font-bold">{portfolio.overview.avgSatisfaction}/5</p>
          <p className="text-orange-100 text-sm">Satisfaction moyenne</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
          <BookOpen className="w-8 h-8 mb-3 opacity-80" />
          <p className="text-3xl font-bold">{portfolio.overview.coursesCount}</p>
          <p className="text-purple-100 text-sm">Cours créés</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {['overview', 'achievements', 'publications', 'training', 'projects'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'overview' && 'Vue d\'ensemble'}
                {tab === 'achievements' && 'Distinctions'}
                {tab === 'publications' && 'Publications'}
                {tab === 'training' && 'Formations'}
                {tab === 'projects' && 'Projets'}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Mes distinctions</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>
              {portfolio.achievements.map(achievement => (
                <div key={achievement.id} className="flex items-start gap-4 p-4 border rounded-xl hover:border-blue-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{achievement.org}</p>
                    <p className="text-xs text-gray-500">{achievement.date}</p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Publications Tab */}
          {activeTab === 'publications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Publications et travaux</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>
              {portfolio.publications.map(pub => (
                <div key={pub.id} className="p-4 border rounded-xl hover:border-blue-300">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded mb-2 inline-block">{pub.type}</span>
                      <h4 className="font-semibold text-gray-800 mb-2">{pub.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">
                        {pub.journal || pub.publisher} • {pub.year}
                      </p>
                      {pub.citations && <p className="text-xs text-gray-500">{pub.citations} citations</p>}
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Training Tab */}
          {activeTab === 'training' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Formations continues</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>
              {portfolio.training.map(training => (
                <div key={training.id} className="flex items-start gap-4 p-4 border rounded-xl hover:border-blue-300">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    training.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <Target className={`w-6 h-6 ${training.status === 'completed' ? 'text-green-600' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-800">{training.title}</h4>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        training.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {training.status === 'completed' ? 'Terminé' : 'En cours'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{training.provider}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{training.duration}</span>
                      <span>•</span>
                      <span>{training.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Projets pédagogiques</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>
              {portfolio.projects.map(project => (
                <div key={project.id} className="p-4 border rounded-xl hover:border-blue-300">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">{project.name}</h4>
                      <p className="text-sm text-gray-600">{project.role} • {project.year}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg">
                      {project.students} étudiants
                    </span>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800"><strong>Impact:</strong> {project.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherPortfolioPage;
