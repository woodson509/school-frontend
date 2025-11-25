/**
 * Teacher Lesson Planner Page
 * Plan lessons with objectives and resources
 * INNOVATIVE: Drag-and-drop lesson builder with templates
 */

import { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  BookOpen,
  FileText,
  CheckCircle,
  ChevronRight,
  Copy,
  Eye,
  Save,
  Lightbulb,
  Users,
  Play,
  Pause,
} from 'lucide-react';

const TeacherLessonPlannerPage = () => {
  const [lessons, setLessons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sampleLessons = [
      {
        id: 1,
        title: 'Introduction aux intégrales',
        class: '6ème A',
        date: '2024-12-16',
        duration: 90,
        status: 'planned',
        objectives: ['Comprendre le concept d\'aire sous une courbe', 'Calculer des intégrales simples'],
        activities: [
          { type: 'intro', title: 'Rappel des dérivées', duration: 10 },
          { type: 'lesson', title: 'Présentation des intégrales', duration: 30 },
          { type: 'practice', title: 'Exercices guidés', duration: 25 },
          { type: 'exercise', title: 'Travail individuel', duration: 20 },
          { type: 'recap', title: 'Synthèse et questions', duration: 5 },
        ],
        resources: ['Manuel p.145-160', 'Diaporama intégrales.pptx'],
        homework: 'Exercices 1-5 page 161',
      },
      {
        id: 2,
        title: 'Équations du second degré',
        class: '5ème B',
        date: '2024-12-17',
        duration: 90,
        status: 'planned',
        objectives: ['Résoudre des équations du 2nd degré', 'Utiliser le discriminant'],
        activities: [
          { type: 'intro', title: 'Révision équations 1er degré', duration: 10 },
          { type: 'lesson', title: 'Formule du discriminant', duration: 35 },
          { type: 'practice', title: 'Exemples au tableau', duration: 20 },
          { type: 'exercise', title: 'Exercices en binômes', duration: 20 },
          { type: 'recap', title: 'Récapitulatif', duration: 5 },
        ],
        resources: ['Manuel p.98-110', 'Fiche méthode discriminant'],
        homework: 'Exercices 12-18 page 112',
      },
      {
        id: 3,
        title: 'Statistiques descriptives',
        class: '4ème A',
        date: '2024-12-15',
        duration: 60,
        status: 'completed',
        objectives: ['Calculer moyenne, médiane, écart-type'],
        activities: [
          { type: 'intro', title: 'Introduction', duration: 5 },
          { type: 'lesson', title: 'Cours statistiques', duration: 25 },
          { type: 'practice', title: 'Calculs sur tableur', duration: 25 },
          { type: 'recap', title: 'Conclusion', duration: 5 },
        ],
        resources: ['Tableur Excel', 'Données exemple'],
        homework: 'Analyser un jeu de données',
      },
    ];

    setTimeout(() => {
      setLessons(sampleLessons);
      setLoading(false);
    }, 500);
  }, []);

  const activityTypes = {
    intro: { label: 'Introduction', color: 'bg-blue-100 text-blue-700', icon: Play },
    lesson: { label: 'Cours', color: 'bg-indigo-100 text-indigo-700', icon: BookOpen },
    practice: { label: 'Pratique guidée', color: 'bg-purple-100 text-purple-700', icon: Users },
    exercise: { label: 'Exercices', color: 'bg-green-100 text-green-700', icon: FileText },
    recap: { label: 'Récapitulatif', color: 'bg-orange-100 text-orange-700', icon: CheckCircle },
  };

  const getStatusBadge = (status) => {
    const styles = {
      planned: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      draft: 'bg-gray-100 text-gray-700',
    };
    const labels = { planned: 'Planifié', completed: 'Terminé', draft: 'Brouillon' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const templates = [
    { id: 1, name: 'Cours standard (90 min)', description: 'Intro, cours, pratique, exercices, récap' },
    { id: 2, name: 'TP/Atelier (60 min)', description: 'Intro, manipulation, synthèse' },
    { id: 3, name: 'Révision (45 min)', description: 'Rappels, exercices, questions' },
    { id: 4, name: 'Évaluation (60 min)', description: 'Consignes, travail individuel, ramassage' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Planificateur de cours</h1>
          <p className="text-gray-500">{lessons.length} leçons planifiées</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Nouvelle leçon
        </button>
      </div>

      {/* Quick Templates */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-indigo-600" />
          Modèles rapides
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {templates.map((template) => (
            <button
              key={template.id}
              className="p-4 bg-white rounded-lg border border-indigo-100 hover:border-indigo-300 text-left transition-colors"
            >
              <p className="font-medium text-gray-800 text-sm">{template.name}</p>
              <p className="text-xs text-gray-500 mt-1">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lessons List */}
        <div className="lg:col-span-2 space-y-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all ${
                selectedLesson?.id === lesson.id ? 'ring-2 ring-indigo-500' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedLesson(lesson)}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {lesson.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {lesson.duration} min
                      </span>
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs">
                        {lesson.class}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(lesson.status)}
                </div>

                {/* Timeline Preview */}
                <div className="flex items-center gap-1 mt-4">
                  {lesson.activities.map((activity, i) => {
                    const type = activityTypes[activity.type];
                    const width = (activity.duration / lesson.duration) * 100;
                    return (
                      <div
                        key={i}
                        className={`h-2 rounded-full ${type.color.split(' ')[0]}`}
                        style={{ width: `${width}%` }}
                        title={`${activity.title} (${activity.duration} min)`}
                      />
                    );
                  })}
                </div>

                {/* Objectives */}
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Objectifs:</p>
                  <div className="flex flex-wrap gap-2">
                    {lesson.objectives.map((obj, i) => (
                      <span key={i} className="flex items-center gap-1 text-xs text-gray-600">
                        <Target className="w-3 h-3 text-indigo-500" />
                        {obj}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg">
                    <Eye className="w-4 h-4" />
                    Voir
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg">
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg">
                    <Copy className="w-4 h-4" />
                    Dupliquer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lesson Detail */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {selectedLesson ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{selectedLesson.title}</h3>
                <p className="text-sm text-gray-500">
                  {selectedLesson.class} • {selectedLesson.date} • {selectedLesson.duration} min
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Déroulement</h4>
                <div className="space-y-2">
                  {selectedLesson.activities.map((activity, i) => {
                    const type = activityTypes[activity.type];
                    const TypeIcon = type.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type.color}`}>
                          <TypeIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                          <p className="text-xs text-gray-500">{type.label}</p>
                        </div>
                        <span className="text-sm text-gray-500">{activity.duration} min</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Objectifs</h4>
                <ul className="space-y-2">
                  {selectedLesson.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <Target className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Ressources</h4>
                <div className="space-y-2">
                  {selectedLesson.resources.map((res, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4 text-gray-400" />
                      {res}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Devoirs</h4>
                <p className="text-sm text-gray-600 p-3 bg-orange-50 rounded-lg">
                  {selectedLesson.homework}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Sélectionnez une leçon pour voir les détails</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Nouvelle leçon</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-500 text-center py-8">
                Formulaire de création de leçon...
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherLessonPlannerPage;
