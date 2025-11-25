/**
 * Teacher Help Page
 * Support and resources
 */

import { useState } from 'react';
import { HelpCircle, Book, Video, MessageSquare, Search, ChevronDown } from 'lucide-react';

const TeacherHelpPage = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    { id: 1, q: 'Comment créer un nouveau cours?', a: 'Allez dans Enseignement > Créer un cours et remplissez le formulaire.' },
    { id: 2, q: 'Comment corriger les devoirs?', a: 'Accédez à Évaluation > Devoirs à corriger pour voir tous les devoirs soumis.' },
    { id: 3, q: 'Comment suivre la progression des étudiants?', a: 'Utilisez la page Analytics pour voir les statistiques détaillées par classe ou par étudiant.' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Centre d'aide</h1>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher dans l'aide..."
          className="w-full pl-12 pr-4 py-3 border rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <Book className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-800 mb-2">Guide utilisateur</h3>
          <p className="text-sm text-gray-600">Documentation complète</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <Video className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-800 mb-2">Tutoriels vidéo</h3>
          <p className="text-sm text-gray-600">Apprenez en vidéo</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <MessageSquare className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-800 mb-2">Support</h3>
          <p className="text-sm text-gray-600">Contactez-nous</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Questions fréquentes</h3>
        <div className="space-y-3">
          {faqs.map(faq => (
            <div key={faq.id} className="border rounded-lg">
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-medium text-gray-800">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${expandedFaq === faq.id ? 'rotate-180' : ''}`} />
              </button>
              {expandedFaq === faq.id && (
                <div className="px-4 pb-4 text-gray-600">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherHelpPage;
