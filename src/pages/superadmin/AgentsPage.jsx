/**
 * Agents Management Page
 * Manage sales agents with API integration
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
  BarChart,
  Loader,
  X,
  Star
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [error, setError] = useState('');

  // Fetch agents
  const fetchAgents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/agents`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch agents');

      const data = await response.json();
      if (data.success) {
        setAgents(data.data);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // Handle Create/Update
  const handleSave = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const url = editingAgent
        ? `${API_BASE_URL}/agents/${editingAgent.id}`
        : `${API_BASE_URL}/agents`;

      const method = editingAgent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Operation failed');
      }

      if (data.success) {
        await fetchAgents(); // Reload list
        setShowModal(false);
        setEditingAgent(null);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/agents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setAgents(agents.filter(a => a.id !== id));
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      alert('Erreur lors de la suppression: ' + err.message);
    }
  };

  // Filter agents
  const filteredAgents = agents.filter(agent =>
    agent.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.agent_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const stats = {
    totalAgents: agents.length,
    totalRevenue: agents.reduce((acc, curr) => acc + (parseFloat(curr.completed_sales_amount) || 0), 0),
    totalCommission: agents.reduce((acc, curr) => acc + (parseFloat(curr.total_commission_earned) || 0), 0),
    totalSales: agents.reduce((acc, curr) => acc + (parseInt(curr.total_sales_count) || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8 text-blue-600" />
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
            placeholder="Rechercher (nom, email, code)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
        <button
          onClick={() => { setEditingAgent(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nouvel agent
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <UserCog className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalAgents}</p>
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
                ${stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Revenus générés</p>
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
                ${stats.totalCommission.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Commissions versées</p>
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
                {stats.totalSales}
              </p>
              <p className="text-sm text-gray-500">Ventes totales</p>
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
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Code</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Commission</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Ventes</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Revenus</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Commissions</th>
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
                      <span className="font-medium text-purple-600">
                        {agent.full_name?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{agent.full_name}</p>
                      <p className="text-sm text-gray-500">{agent.email}</p>
                      {agent.phone && <p className="text-xs text-gray-400">{agent.phone}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-gray-600">
                  {agent.agent_code}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {agent.commission_rate}%
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  {agent.total_sales_count || 0}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  ${parseFloat(agent.completed_sales_amount || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-green-600">
                  ${parseFloat(agent.total_commission_earned || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${agent.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {agent.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => { setEditingAgent(agent); setShowModal(true); }}
                      className="p-2 hover:bg-gray-100 rounded-lg text-blue-600"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(agent.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredAgents.length === 0 && (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  Aucun agent trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <AgentModal
          agent={editingAgent}
          onClose={() => { setShowModal(false); setEditingAgent(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const AgentModal = ({ agent, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    full_name: agent?.full_name || '',
    email: agent?.email || '',
    phone: agent?.phone || '',
    password: '',
    commission_rate: agent?.commission_rate || 10,
    is_active: agent ? agent.is_active : true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            {agent ? 'Modifier l\'agent' : 'Nouvel agent'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {!agent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required={!agent}
                minLength={6}
              />
            </div>
          )}


          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+509..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commission (%) *</label>
              <input
                type="number"
                value={formData.commission_rate}
                onChange={(e) => setFormData({ ...formData, commission_rate: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
                step="0.1"
                required
              />
            </div>
          </div>

          {agent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">Actif</option>
                <option value="false">Inactif</option>
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {agent ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div >
    </div >
  );
};

export default AgentsPage;
