/**
 * Student Certificates Page
 * View and download certificates and achievements
 */

import { useState, useEffect } from 'react';
import {
  Award,
  Download,
  Eye,
  Calendar,
  CheckCircle,
  Star,
  Trophy,
  Medal,
  FileText,
  Share2,
} from 'lucide-react';

const StudentCertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activeTab, setActiveTab] = useState('certificates');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sampleCertificates = [
      { id: 1, title: 'Certificat de scolarité', type: 'official', date: '2024-09-01', status: 'available', description: 'Attestation d\'inscription pour l\'année 2024-2025' },
      { id: 2, title: 'Bulletin 1er trimestre', type: 'report', date: '2024-12-15', status: 'available', description: 'Résultats du premier trimestre' },
      { id: 3, title: 'Attestation de présence', type: 'official', date: '2024-11-20', status: 'available', description: 'Attestation pour la période de septembre à novembre' },
      { id: 4, title: 'Bulletin 2ème trimestre', type: 'report', date: '2025-03-15', status: 'pending', description: 'Résultats du deuxième trimestre' },
    ];

    const sampleAchievements = [
      { id: 1, title: 'Excellence académique', type: 'gold', date: '2024-12-10', description: 'Moyenne générale supérieure à 16/20', icon: 'trophy' },
      { id: 2, title: 'Assiduité parfaite', type: 'silver', date: '2024-11-30', description: '100% de présence sur le trimestre', icon: 'star' },
      { id: 3, title: 'Meilleur en Informatique', type: 'gold', date: '2024-12-05', description: 'Première place de la classe en Informatique', icon: 'medal' },
      { id: 4, title: 'Participation active', type: 'bronze', date: '2024-10-15', description: 'Contribution exceptionnelle en classe', icon: 'award' },
      { id: 5, title: 'Concours Maths - 3ème place', type: 'silver', date: '2024-11-20', description: 'Concours régional de mathématiques', icon: 'medal' },
    ];
    
    setTimeout(() => {
      setCertificates(sampleCertificates);
      setAchievements(sampleAchievements);
      setLoading(false);
    }, 500);
  }, []);

  const getAchievementIcon = (icon) => {
    const icons = {
      trophy: <Trophy className="w-6 h-6" />,
      star: <Star className="w-6 h-6" />,
      medal: <Medal className="w-6 h-6" />,
      award: <Award className="w-6 h-6" />,
    };
    return icons[icon] || <Award className="w-6 h-6" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      gold: 'from-yellow-400 to-yellow-600',
      silver: 'from-gray-300 to-gray-500',
      bronze: 'from-orange-400 to-orange-600',
    };
    return colors[type] || 'from-emerald-400 to-emerald-600';
  };

  const getTypeBorder = (type) => {
    const colors = {
      gold: 'border-yellow-400',
      silver: 'border-gray-400',
      bronze: 'border-orange-400',
    };
    return colors[type] || 'border-emerald-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Certificats & Récompenses</h1>
        <p className="text-gray-500">Vos documents officiels et distinctions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {certificates.filter(c => c.status === 'available').length}
              </p>
              <p className="text-xs text-gray-500">Certificats</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {achievements.filter(a => a.type === 'gold').length}
              </p>
              <p className="text-xs text-gray-500">Or</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Medal className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {achievements.filter(a => a.type === 'silver').length}
              </p>
              <p className="text-xs text-gray-500">Argent</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {achievements.filter(a => a.type === 'bronze').length}
              </p>
              <p className="text-xs text-gray-500">Bronze</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('certificates')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'certificates'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-5 h-5 inline-block mr-2" />
              Certificats
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'achievements'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Award className="w-5 h-5 inline-block mr-2" />
              Récompenses
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'certificates' && (
            <div className="space-y-4">
              {certificates.map(cert => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      cert.status === 'available' ? 'bg-emerald-100' : 'bg-gray-100'
                    }`}>
                      <FileText className={`w-6 h-6 ${
                        cert.status === 'available' ? 'text-emerald-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{cert.title}</h3>
                      <p className="text-sm text-gray-500">{cert.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {cert.date}
                        </span>
                        {cert.status === 'available' ? (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <CheckCircle className="w-3 h-3" />
                            Disponible
                          </span>
                        ) : (
                          <span className="text-orange-500">En attente</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {cert.status === 'available' && (
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="Aperçu">
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="Télécharger">
                        <Download className="w-5 h-5 text-emerald-600" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`relative overflow-hidden rounded-xl border-2 ${getTypeBorder(achievement.type)} bg-white p-5`}
                >
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${getTypeColor(achievement.type)} opacity-10 rounded-bl-full`} />
                  
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTypeColor(achievement.type)} flex items-center justify-center text-white mb-4`}>
                    {getAchievementIcon(achievement.icon)}
                  </div>
                  
                  <h3 className="font-semibold text-gray-800 mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{achievement.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {achievement.date}
                    </span>
                    <button className="p-1 hover:bg-gray-100 rounded" title="Partager">
                      <Share2 className="w-4 h-4 text-gray-400" />
                    </button>
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

export default StudentCertificatesPage;
