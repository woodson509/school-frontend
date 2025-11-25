/**
 * Student Progress Page
 * Track overall academic progress and analytics
 */

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Calendar,
  BookOpen,
  Clock,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const StudentProgressPage = () => {
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    const data = {
      overview: {
        globalAverage: 15.2,
        previousAverage: 14.5,
        rank: 5,
        totalStudents: 32,
        studyHours: 45,
        coursesCompleted: 3,
        attendanceRate: 94,
      },
      subjectProgress: [
        { subject: 'Mathématiques', current: 15.5, previous: 14.2, trend: 'up', color: '#3B82F6' },
        { subject: 'Physique', current: 14.2, previous: 14.8, trend: 'down', color: '#8B5CF6' },
        { subject: 'Français', current: 13.8, previous: 13.0, trend: 'up', color: '#EF4444' },
        { subject: 'Anglais', current: 16.5, previous: 15.8, trend: 'up', color: '#F59E0B' },
        { subject: 'Histoire', current: 14.0, previous: 13.5, trend: 'up', color: '#EC4899' },
        { subject: 'Informatique', current: 17.5, previous: 16.0, trend: 'up', color: '#6366F1' },
      ],
      monthlyProgress: [
        { month: 'Sep', average: 13.5 },
        { month: 'Oct', average: 14.0 },
        { month: 'Nov', average: 14.5 },
        { month: 'Déc', average: 15.2 },
      ],
      skills: [
        { name: 'Résolution de problèmes', level: 85 },
        { name: 'Travail en équipe', level: 78 },
        { name: 'Pensée critique', level: 82 },
        { name: 'Communication', level: 75 },
        { name: 'Créativité', level: 88 },
      ],
      recentAchievements: [
        { title: 'Top 5 de la classe', date: '2024-12-10', type: 'rank' },
        { title: 'Meilleure note en Info', date: '2024-12-05', type: 'grade' },
        { title: '10 jours consécutifs', date: '2024-12-01', type: 'streak' },
      ],
      goals: [
        { title: 'Atteindre 16/20 de moyenne', progress: 75, target: 16, current: 15.2 },
        { title: 'Top 3 de la classe', progress: 60, target: 3, current: 5 },
        { title: '100% assiduité', progress: 94, target: 100, current: 94 },
      ],
    };
    
    setTimeout(() => {
      setProgressData(data);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const { overview, subjectProgress, skills, goals, recentAchievements } = progressData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Ma progression</h1>
        <p className="text-gray-500">Suivez votre évolution académique</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white">
          <p className="text-emerald-100 text-sm mb-1">Moyenne générale</p>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold">{overview.globalAverage}</p>
            <div className="flex items-center text-emerald-100 mb-1">
              {overview.globalAverage > overview.previousAverage ? (
                <>
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm">+{(overview.globalAverage - overview.previousAverage).toFixed(1)}</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4" />
                  <span className="text-sm">{(overview.globalAverage - overview.previousAverage).toFixed(1)}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Classement</p>
          <p className="text-3xl font-bold text-gray-800">
            {overview.rank}<span className="text-lg text-gray-400">/{overview.totalStudents}</span>
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            Top {Math.round((overview.rank / overview.totalStudents) * 100)}%
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Heures d'étude</p>
          <p className="text-3xl font-bold text-gray-800">{overview.studyHours}h</p>
          <p className="text-xs text-gray-400 mt-1">Ce mois</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-gray-500 text-sm mb-1">Assiduité</p>
          <p className="text-3xl font-bold text-gray-800">{overview.attendanceRate}%</p>
          <p className="text-xs text-emerald-600 mt-1">Excellent</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Progress */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Progression par matière</h3>
          <div className="space-y-4">
            {subjectProgress.map((subject, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-28 text-sm font-medium text-gray-700">{subject.subject}</div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(subject.current / 20) * 100}%`,
                        backgroundColor: subject.color,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 w-24">
                  <span className="font-bold" style={{ color: subject.color }}>
                    {subject.current}
                  </span>
                  {subject.trend === 'up' ? (
                    <span className="flex items-center text-green-500 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      +{(subject.current - subject.previous).toFixed(1)}
                    </span>
                  ) : (
                    <span className="flex items-center text-red-500 text-sm">
                      <TrendingDown className="w-4 h-4" />
                      {(subject.current - subject.previous).toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Mes objectifs</h3>
          <div className="space-y-4">
            {goals.map((goal, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{goal.title}</span>
                  <span className="text-sm text-emerald-600">{goal.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Radar */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Compétences</h3>
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{skill.name}</span>
                  <span className="text-sm font-medium text-gray-800">{skill.level}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Succès récents</h3>
          <div className="space-y-3">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  achievement.type === 'rank' ? 'bg-yellow-100' :
                  achievement.type === 'grade' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {achievement.type === 'rank' && <Award className="w-5 h-5 text-yellow-600" />}
                  {achievement.type === 'grade' && <Target className="w-5 h-5 text-green-600" />}
                  {achievement.type === 'streak' && <Zap className="w-5 h-5 text-orange-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{achievement.title}</p>
                  <p className="text-xs text-gray-400">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Evolution Chart (simplified) */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Évolution mensuelle</h3>
        <div className="flex items-end justify-around h-48 px-4">
          {progressData.monthlyProgress.map((month, index) => {
            const height = (month.average / 20) * 100;
            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-emerald-600">{month.average}</span>
                <div
                  className="w-16 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all hover:from-emerald-600 hover:to-teal-500"
                  style={{ height: `${height}%` }}
                />
                <span className="text-sm text-gray-500">{month.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Conseil personnalisé</h3>
            <p className="text-blue-100">
              Votre progression en Mathématiques est excellente ! Continuez ainsi. 
              Pour améliorer votre moyenne en Physique, essayez de consacrer 30 minutes 
              supplémentaires par semaine aux exercices pratiques.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProgressPage;
