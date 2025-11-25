/**
 * Teacher Lesson Planner Page
 * Plan and organize lessons with templates
 */

import { useState } from 'react';
import {
  Target,
  Clock,
  BookOpen,
  CheckSquare,
  Plus,
  Calendar,
  Users,
  Lightbulb,
  FileText,
  Copy,
  Trash2,
  Edit,
  Save,
} from 'lucide-react';

const TeacherPlannerPage = () => {
  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: 'Introduction aux intégrales',
      class: '6ème A',
      date: '2024-12-18',
      duration: 90,
      objectives: ['Comprendre le concept d\'intégrale', 'Calculer des intégrales simples'],
      activities: [
        { type: 'Cours magistral', duration: 30, description: 'Présentation théorique' },
        { type: 'Exercices', duration: 40, description: 'Exercices d\'application' },
        { type: 'Discussion', duration: 20, description: 'Questions-réponses' },
      ],
      resources: ['Manuel page 145', 'Fiche exercices', 'Vidéo explicative'],
      homework: 'Exercices 1 à 5 page 147',
      status: 'planned',
    },
    {
      id: 2,
      title: 'Les fonctions exponentielles',
      class: '5ème B',
      date: '2024-12-19',
      duration: 90,
      objectives: ['Définir la fonction exponentielle', 'Tracer des courbes'],
      activities: [
        { type: 'Rappel', duration: 15, description: 'Révision logarithmes' },
        { type: 'Cours', duration: 35, description: 'Théorie des exponentielles' },
        { type: 'TP', duration: 40, description: 'Tracé sur calculatrice' },
      ],
      resources: ['Calculatrices', 'Fiche méthode'],
      homework: 'TP à terminer',
      status: 'draft',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 1,
      name: 'Cours magistral',
      icon: BookOpen,
      duration: 90,
      structure: [
        { type: 'Introduction', duration: 10 },
        { type: 'Cours théorique', duration: 50 },
        { type: 'Exercices', duration: 20 },
        { type: 'Conclusion', duration: 10 },
      ],
    },
    {
      id: 2,
      name: 'Travaux pratiques',
      icon: CheckSquare,
      duration: 90,
      structure: [
        { type: 'Consignes', duration: 15 },
        { type: 'Travail en groupe', duration: 60 },
        { type: 'Restitution', duration: 15 },
      ],
    },
    {
      id: 3,
      name: 'Évaluation',
      icon: FileText,
      duration: 60,
      structure: [
        { type: 'Instructions', duration: 5 },
        { type: 'Contrôle', duration: 50 },
        { type: 'Correction rapide', duration: 5 },
      ],
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      planned: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
    };
    const labels = { draft: 'Brouillon', planned: 'Planifié', completed: 'Terminé' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getTotalTime = (activities) => {
    return activities.reduce((sum, act) => sum + act.duration, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Planificateur de cours</h1>
          <p className="text-gray-500">Organisez vos séances efficacement</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Planifier un cours
        </button>
      </div>

      {/* Templates */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Modèles de cours</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map(template => {
            const Icon = template.icon;
            return (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">{template.name}</h4>
                <p className="text-sm text-gray-500 mb-2">{template.duration} minutes</p>
                <div className="space-y-1">
                  {template.structure.map((step, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-gray-600">
                      <span>{step.type}</span>
                      <span>{step.duration}min</span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upcoming Lessons */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Prochains cours planifiés</h3>
        {lessons.map(lesson => (
          <div key={lesson.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{lesson.title}</h3>
                  {getStatusBadge(lesson.status)}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {lesson.class}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {lesson.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {lesson.duration} min
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Objectives */}
              <div>
                <h4 className="flex items-center gap-2 font-medium text-gray-700 mb-3">
                  <Target className="w-4 h-4 text-blue-600" />
                  Objectifs pédagogiques
                </h4>
                <ul className="space-y-2">
                  {lesson.objectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckSquare className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Activities Timeline */}
              <div>
                <h4 className="flex items-center gap-2 font-medium text-gray-700 mb-3">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Déroulement
                </h4>
                <div className="space-y-3">
                  {lesson.activities.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-16 text-xs font-medium text-gray-500 flex-shrink-0">
                        {activity.duration}min
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-800">{activity.type}</p>
                        <p className="text-xs text-gray-500">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-600">
                      Total: {getTotalTime(lesson.activities)} minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources & Homework */}
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Ressources nécessaires</h5>
                <div className="flex flex-wrap gap-2">
                  {lesson.resources.map((resource, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Devoir à donner</h5>
                <p className="text-sm text-gray-600">{lesson.homework}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Astuce pédagogique</h3>
            <p className="text-orange-50">
              Pour une séance de 90 minutes, alternez entre théorie et pratique toutes les 20-30 minutes 
              pour maintenir l'attention des étudiants. N'oubliez pas de prévoir 10 minutes pour les questions!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPlannerPage;
