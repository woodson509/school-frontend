/**
 * Support Page
 * Help center and support tickets
 */

import { useState } from 'react';
import {
  HelpCircle,
  Search,
  MessageSquare,
  Book,
  Video,
  Mail,
  Phone,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

const SupportPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);

  const faqs = [
    { id: 1, question: 'Comment ajouter un nouvel utilisateur ?', category: 'Utilisateurs', views: 245 },
    { id: 2, question: 'Comment exporter les notes en Excel ?', category: 'Notes', views: 189 },
    { id: 3, question: 'Comment créer un examen avec minuterie ?', category: 'Examens', views: 156 },
    { id: 4, question: 'Comment configurer les notifications email ?', category: 'Paramètres', views: 134 },
    { id: 5, question: 'Comment restaurer une sauvegarde ?', category: 'Système', views: 112 },
    { id: 6, question: 'Comment gérer les rôles et permissions ?', category: 'Sécurité', views: 98 },
  ];

  const tickets = [
    { id: 'TKT-001', subject: 'Problème d\'export PDF', status: 'open', priority: 'high', date: '2024-12-15', lastUpdate: 'Il y a 2h' },
    { id: 'TKT-002', subject: 'Erreur lors de la connexion', status: 'in_progress', priority: 'medium', date: '2024-12-14', lastUpdate: 'Il y a 1j' },
    { id: 'TKT-003', subject: 'Demande de nouvelle fonctionnalité', status: 'resolved', priority: 'low', date: '2024-12-10', lastUpdate: 'Il y a 5j' },
  ];

  const resources = [
    { id: 1, title: 'Guide de démarrage', icon: Book, type: 'Documentation', link: '#' },
    { id: 2, title: 'Tutoriels vidéo', icon: Video, type: 'Vidéos', link: '#' },
    { id: 3, title: 'API Documentation', icon: Book, type: 'Technique', link: '#' },
    { id: 4, title: 'Notes de version', icon: Book, type: 'Changelog', link: '#' },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-orange-100 text-orange-700',
      in_progress: 'bg-blue-100 text-blue-700',
      resolved: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-700',
    };
    const labels = {
      open: 'Ouvert',
      in_progress: 'En cours',
      resolved: 'Résolu',
      closed: 'Fermé',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-gray-100 text-gray-700',
    };
    const labels = { high: 'Haute', medium: 'Moyenne', low: 'Basse' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>
        {labels[priority]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Comment pouvons-nous vous aider ?</h2>
        <p className="text-blue-100 mb-6">Recherchez dans notre base de connaissances ou contactez-nous</p>
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une question ou un sujet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-800 focus:ring-2 focus:ring-white"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Chat en direct</h3>
          <p className="text-sm text-gray-500 mb-4">Discutez avec notre équipe support</p>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
            Démarrer le chat →
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
          <p className="text-sm text-gray-500 mb-4">support@schoollms.com</p>
          <button className="text-green-600 text-sm font-medium hover:text-green-700">
            Envoyer un email →
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
            <Phone className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Téléphone</h3>
          <p className="text-sm text-gray-500 mb-4">+509 1234-5678</p>
          <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
            Appeler maintenant →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Questions fréquentes</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">Voir tout</button>
          </div>
          <div className="space-y-3">
            {faqs.map(faq => (
              <div
                key={faq.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{faq.question}</p>
                    <p className="text-xs text-gray-500">{faq.category} • {faq.views} vues</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ressources</h3>
          <div className="grid grid-cols-2 gap-4">
            {resources.map(resource => (
              <a
                key={resource.id}
                href={resource.link}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <resource.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{resource.title}</p>
                  <p className="text-xs text-gray-500">{resource.type}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Support Tickets */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Mes tickets de support</h3>
          <button
            onClick={() => setShowTicketModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            Nouveau ticket
          </button>
        </div>
        
        {tickets.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sujet</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Priorité</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Dernière mise à jour</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-blue-600">{ticket.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{ticket.subject}</td>
                  <td className="px-6 py-4">{getStatusBadge(ticket.status)}</td>
                  <td className="px-6 py-4">{getPriorityBadge(ticket.priority)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{ticket.lastUpdate}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Voir détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun ticket de support</p>
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Nouveau ticket de support</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Décrivez brièvement le problème"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Problème technique</option>
                  <option>Question sur les fonctionnalités</option>
                  <option>Demande de fonctionnalité</option>
                  <option>Facturation</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Décrivez votre problème en détail..."
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Soumettre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportPage;
