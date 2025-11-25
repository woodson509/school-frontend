/**
 * Agents Management Page
 * Manage sales agents
 */

import { useState, useEffect } from 'react';
import {
  UserCog,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  TrendingUp,
  Phone,
  Mail,
  Star,
  BarChart,
} from 'lucide-react';

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

  useEffect(() => {
    const sampleAgents = [
      {
        id: 1,
        name: 'Sophie Laurent',
        email: 'sophie@agent.com',
        phone: '+509 1234-5678',
        region: 'Port-au-Prince',
        commissionRate: 10,
        totalSales: 25,
        totalRevenue: 125000,
        totalCommission: 12500,
        status: 'active',
        joinDate: '2024-01-15',
        rating: 4.8,
      },
      {
        id: 2,
        name: 'Jean-Marc Pierre',
        email: 'jeanmarc@agent.com',
        phone: '+509 2345-6789',
        region: 'Pétion-Ville',
        commissionRate: 12,
        totalSales: 18,
        totalRevenue: 95000,
        totalCommission: 11400,
        status: 'active',
        joinDate: '2024-02-20',
        rating: 4.5,
      },
      {
        id: 3,
        name: 'Marie Dubois',
        email: 'marie@agent.com',
        phone: '+509 3456-7890',
        region: 'Carrefour',
        commissionRate: 10,
        totalSales: 12,
        totalRevenue: 68000,
        totalCommission: 6800,
        status: 'active',
        joinDate: '2024-03-10',
        rating: 4.2,
      },
      {
        id: 4,
        name: 'Paul Fernand',
        email: 'paul@agent.com',
        phone: '+509 4567-8901',
        region: 'Delmas',
        commissionRate: 8,
        totalSales: 8,
        totalRevenue: 42000,
        totalCommission: 3360,
        status: 'inactive',
        joinDate: '2024-04-05',
        rating: 3.8,
      },
    ];
    
    setTimeout(() => {
      setAgents(sampleAgents);
      setLoading(false);
    }, 500);
  }, []);

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
      setAgents(agents.filter(a => a.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un agent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Ajouter agent
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <UserCog className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{agents.length}</p>
              <p className="text-sm text-gray-500">Agents</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                ${agents.reduce((acc, a) => acc + a.totalRevenue, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Ventes totales</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                ${agents.reduce((acc, a) => acc + a.totalCommission, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Commissions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <BarChart className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {agents.reduce((acc, a) => acc + a.totalSales, 0)}
              </p>
              <p className="text-sm text-gray-500">Ventes ce mois</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agents Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Agent</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Région</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Commission</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Ventes</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Revenus</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Note</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAgents.map((agent) => (
              <tr key={agent.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="font-medium text-purple-600">{agent.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{agent.name}</p>
                      <p className="text-sm text-gray-500">{agent.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{agent.region}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {agent.commissionRate}%
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{agent.totalSales}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  ${agent.totalRevenue.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">{agent.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    agent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {agent.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="Voir">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => { setEditingAgent(agent); setShowModal(true); }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(agent.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <AgentModal
          agent={editingAgent}
          onClose={() => { setShowModal(false); setEditingAgent(null); }}
          onSave={(data) => {
            if (editingAgent) {
              setAgents(agents.map(a => a.id === editingAgent.id ? { ...a, ...data } : a));
            } else {
              setAgents([...agents, { ...data, id: Date.now(), totalSales: 0, totalRevenue: 0, totalCommission: 0, rating: 0 }]);
            }
            setShowModal(false);
            setEditingAgent(null);
          }}
        />
      )}
    </div>
  );
};

const AgentModal = ({ agent, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: agent?.name || '',
    email: agent?.email || '',
    phone: agent?.phone || '',
    region: agent?.region || '',
    commissionRate: agent?.commissionRate || 10,
    status: agent?.status || 'active',
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          {agent ? 'Modifier l\'agent' : 'Nouvel agent'}
        </h3>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Région</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commission (%)</label>
              <input
                type="number"
                value={formData.commissionRate}
                onChange={(e) => setFormData({ ...formData, commissionRate: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {agent ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentsPage;
