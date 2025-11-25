/**
 * Teacher Create Assignment Page
 * Build and publish assignments
 */

import { useState } from 'react';
import {
  FileText,
  Calendar,
  Users,
  Upload,
  Plus,
  X,
  Save,
  Send,
  Clock,
  AlertCircle,
} from 'lucide-react';

const TeacherCreateAssignmentPage = () => {
  const [assignment, setAssignment] = useState({
    title: '',
    description: '',
    class: '',
    subject: '',
    dueDate: '',
    dueTime: '',
    totalPoints: 20,
    instructions: '',
    attachments: [],
    allowLateSubmission: true,
    latePenalty: 10,
    submissionType: 'file', // file, text, both
  });

  const classes = ['6ème A', '6ème B', '5ème A', '5ème B', '4ème C'];
  const subjects = ['Mathématiques', 'Physique', 'Français', 'Anglais'];

  const [attachments, setAttachments] = useState([]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSaveDraft = () => {
    console.log('Save draft:', assignment);
    alert('Brouillon sauvegardé!');
  };

  const handlePublish = () => {
    console.log('Publish assignment:', assignment);
    alert('Devoir publié et envoyé aux étudiants!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Créer un devoir</h1>
          <p className="text-gray-500">Assignez du travail à vos étudiants</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Save className="w-4 h-4" />
            Brouillon
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
            Publier
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* Basic Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre du devoir *
          </label>
          <input
            type="text"
            value={assignment.title}
            onChange={(e) => setAssignment({...assignment, title: e.target.value})}
            placeholder="Ex: Exercices sur les intégrales"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classe *
            </label>
            <select
              value={assignment.class}
              onChange={(e) => setAssignment({...assignment, class: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une classe</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matière *
            </label>
            <select
              value={assignment.subject}
              onChange={(e) => setAssignment({...assignment, subject: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une matière</option>
              {subjects.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Due Date & Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date limite *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={assignment.dueDate}
                onChange={(e) => setAssignment({...assignment, dueDate: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heure limite
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="time"
                value={assignment.dueTime}
                onChange={(e) => setAssignment({...assignment, dueTime: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points totaux
            </label>
            <input
              type="number"
              value={assignment.totalPoints}
              onChange={(e) => setAssignment({...assignment, totalPoints: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Consignes *
          </label>
          <textarea
            value={assignment.instructions}
            onChange={(e) => setAssignment({...assignment, instructions: e.target.value})}
            placeholder="Décrivez les consignes du devoir..."
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Attachments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fichiers joints
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Glissez-déposez des fichiers ou cliquez pour parcourir
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Choisir des fichiers
            </label>
          </div>
          
          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                  </div>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submission Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de soumission
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="file"
                checked={assignment.submissionType === 'file'}
                onChange={(e) => setAssignment({...assignment, submissionType: e.target.value})}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">Fichier uniquement</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="text"
                checked={assignment.submissionType === 'text'}
                onChange={(e) => setAssignment({...assignment, submissionType: e.target.value})}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">Texte uniquement</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="both"
                checked={assignment.submissionType === 'both'}
                onChange={(e) => setAssignment({...assignment, submissionType: e.target.value})}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700">Fichier ou texte</span>
            </label>
          </div>
        </div>

        {/* Late Submission */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={assignment.allowLateSubmission}
                  onChange={(e) => setAssignment({...assignment, allowLateSubmission: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Autoriser les soumissions en retard
                </span>
              </label>
              {assignment.allowLateSubmission && (
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600">Pénalité :</label>
                  <input
                    type="number"
                    value={assignment.latePenalty}
                    onChange={(e) => setAssignment({...assignment, latePenalty: parseInt(e.target.value)})}
                    className="w-20 px-3 py-1 border border-gray-300 rounded-lg"
                  />
                  <span className="text-sm text-gray-600">% par jour</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Aperçu</h3>
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">{assignment.title || 'Titre du devoir'}</h4>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {assignment.class || 'Classe'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {assignment.dueDate || 'Date limite'}
            </span>
            <span className="font-medium text-blue-600">{assignment.totalPoints} points</span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{assignment.instructions || 'Les consignes apparaîtront ici...'}</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherCreateAssignmentPage;
