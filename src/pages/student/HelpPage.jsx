/**
 * Student Help Page
 * FAQ, tutorials, and support
 */

import { useState } from 'react';
import {
  HelpCircle,
  Search,
  Book,
  Video,
  MessageSquare,
  Mail,
  Phone,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
} from 'lucide-react';

const StudentHelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      category: 'Connexion',
      question: 'Comment réinitialiser mon mot de passe ?',
      answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion. Entrez votre adresse email et vous recevrez un lien de réinitialisation.',
    },
    {
      id: 2,
      category: 'Cours',
      question: 'Comment accéder à mes cours ?',
      answer: 'Rendez-vous dans la section "Mes cours" du menu latéral. Vous y trouverez tous les cours auxquels vous êtes inscrit.',
    },
    {
      id: 3,
      category: 'Devoirs',
      question: 'Comment soumettre un devoir ?',
      answer: 'Allez dans "Mes devoirs", sélectionnez le devoir concerné, puis cliquez sur "Soumettre". Vous pouvez télécharger un fichier ou rédiger directement.',
    },
    {
      id: 4,
      category: 'Notes',
      question: 'Où puis-je voir mes notes ?',
      answer: 'Toutes vos notes sont accessibles dans la section "Mes notes". Vous pouvez les filtrer par matière ou par période.',
    },
    {
      id: 5,
      category: 'Examens',
      question: 'Comment passer un examen en ligne ?',
      answer: 'Les examens en ligne sont disponibles dans "Mes examens". Cliquez sur "Commencer" pour démarrer. Assurez-vous d\'avoir une connexion stable.',
    },
    {
      id: 6,
      category: 'Technique',
      question: 'L\'application ne fonctionne pas correctement',
      answer: 'Essayez de vider le cache de votre navigateur ou de vous reconnecter. Si le problème persiste, contactez le support.',
    },
    {
      id: 7,
      category: 'Présences',
      question: 'Comment justifier une absence ?',
      answer: 'Contactez le secrétariat dans les 48h avec un justificatif. Vous pouvez aussi envoyer un message via la section "Messages".',
    },
  ];

  const tutorials = [
    { id: 1, title: 'Premiers pas avec EduPortal', duration: '5 min', type: 'video' },
    { id: 2, title: 'Naviguer dans vos cours', duration: '3 min', type: 'video' },
    { id: 3, title: 'Soumettre un devoir', duration: '4 min', type: 'video' },
    { id: 4, title: 'Utiliser le planificateur', duration: '6 min', type: 'video' },
    { id: 5, title: 'Passer un quiz', duration: '3 min', type: 'video' },
  ];

  const guides = [
    { id: 1, title: 'Guide de l\'étudiant', description: 'Tout savoir sur la plateforme', icon: Book },
    { id: 2, title: 'FAQ complète', description: 'Réponses aux questions fréquentes', icon: HelpCircle },
    { id: 3, title: 'Règlement intérieur', description: 'Règles de l\'établissement', icon: FileText },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(faqs.map(f => f.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Centre d'aide</h1>
        <p className="text-emerald-100 mb-6">Comment pouvons-nous vous aider ?</p>
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-800 focus:ring-2 focus:ring-emerald-300"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="#"
          className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Chat en direct</h3>
            <p className="text-sm text-gray-500">Parlez à un assistant</p>
          </div>
        </a>
        <a
          href="mailto:support@eduportal.com"
          className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <Mail className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Email</h3>
            <p className="text-sm text-gray-500">support@eduportal.com</p>
          </div>
        </a>
        <a
          href="tel:+50912345678"
          className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <Phone className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Téléphone</h3>
            <p className="text-sm text-gray-500">+509 1234-5678</p>
          </div>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Questions fréquentes</h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSearchTerm('')}
              className={`px-3 py-1 rounded-full text-sm ${
                !searchTerm ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Toutes
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSearchTerm(cat)}
                className={`px-3 py-1 rounded-full text-sm ${
                  searchTerm === cat ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFaqs.map(faq => (
              <div key={faq.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                      {faq.category}
                    </span>
                    <span className="font-medium text-gray-800">{faq.question}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedFaq === faq.id ? 'rotate-180' : ''
                  }`} />
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-4 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tutorials & Guides */}
        <div className="space-y-6">
          {/* Tutorials */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Tutoriels vidéo</h2>
            <div className="space-y-3">
              {tutorials.map(tutorial => (
                <a
                  key={tutorial.id}
                  href="#"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <Video className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{tutorial.title}</p>
                    <p className="text-xs text-gray-500">{tutorial.duration}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Guides */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Guides et documents</h2>
            <div className="space-y-3">
              {guides.map(guide => (
                <a
                  key={guide.id}
                  href="#"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <guide.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{guide.title}</p>
                    <p className="text-xs text-gray-500">{guide.description}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHelpPage;
