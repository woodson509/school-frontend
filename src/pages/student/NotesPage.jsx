/**
 * Student Notes Page
 * Personal note-taking system
 */

import { useState, useEffect } from 'react';
import {
  PenTool,
  Plus,
  Search,
  Folder,
  FileText,
  Star,
  Trash2,
  Edit,
  Clock,
  Tag,
} from 'lucide-react';

const StudentNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setFolders([
      { id: 'math', name: 'Mathématiques', color: '#3B82F6', count: 5 },
      { id: 'physics', name: 'Physique', color: '#8B5CF6', count: 3 },
      { id: 'french', name: 'Français', color: '#EF4444', count: 4 },
      { id: 'history', name: 'Histoire', color: '#EC4899', count: 2 },
      { id: 'cs', name: 'Informatique', color: '#6366F1', count: 6 },
    ]);

    setNotes([
      { id: 1, title: 'Formules intégrales', folder: 'math', content: '∫x^n dx = x^(n+1)/(n+1) + C\n∫e^x dx = e^x + C\n∫1/x dx = ln|x| + C', starred: true, updatedAt: '2024-12-15', tags: ['formules', 'révision'] },
      { id: 2, title: 'Cours optique', folder: 'physics', content: 'Lois de Snell-Descartes:\nn1.sin(i1) = n2.sin(i2)', starred: false, updatedAt: '2024-12-14', tags: ['cours'] },
      { id: 3, title: 'Citations Victor Hugo', folder: 'french', content: '"Ceux qui vivent sont ceux qui luttent"\n"La vie est un voyage"', starred: true, updatedAt: '2024-12-13', tags: ['citations', 'romantisme'] },
      { id: 4, title: 'Algorithmes de tri', folder: 'cs', content: '1. Tri à bulles: O(n²)\n2. Tri rapide: O(n log n)\n3. Tri fusion: O(n log n)', starred: false, updatedAt: '2024-12-12', tags: ['algo', 'complexité'] },
      { id: 5, title: 'Dates clés WWII', folder: 'history', content: '1939: Début de la guerre\n1944: Débarquement\n1945: Fin de la guerre', starred: false, updatedAt: '2024-12-10', tags: ['dates', 'révision'] },
    ]);
  }, []);

  const filteredNotes = notes.filter(note => {
    const matchesFolder = selectedFolder === 'all' || note.folder === selectedFolder;
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const getFolderColor = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    return folder?.color || '#6B7280';
  };

  const toggleStar = (noteId) => {
    setNotes(notes.map(n => n.id === noteId ? { ...n, starred: !n.starred } : n));
  };

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Sidebar */}
      <div className="w-64 bg-white rounded-l-xl shadow-sm border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            <Plus className="w-4 h-4" />
            Nouvelle note
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <button
              onClick={() => setSelectedFolder('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                selectedFolder === 'all' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Toutes les notes</span>
              </div>
              <span className="text-sm text-gray-500">{notes.length}</span>
            </button>
            <button
              onClick={() => setSelectedFolder('starred')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                selectedFolder === 'starred' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>Favoris</span>
              </div>
              <span className="text-sm text-gray-500">{notes.filter(n => n.starred).length}</span>
            </button>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2 px-3">Dossiers</p>
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  selectedFolder === folder.id ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4" style={{ color: folder.color }} />
                  <span>{folder.name}</span>
                </div>
                <span className="text-sm text-gray-500">{folder.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                selectedNote?.id === note.id ? 'bg-emerald-50' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-medium text-gray-800 line-clamp-1">{note.title}</h3>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleStar(note.id); }}
                  className="p-1"
                >
                  <Star className={`w-4 h-4 ${note.starred ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                </button>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-2">{note.content}</p>
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getFolderColor(note.folder) }}
                />
                <span className="text-xs text-gray-400">{note.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note Editor */}
      <div className="flex-1 bg-white rounded-r-xl shadow-sm flex flex-col">
        {selectedNote ? (
          <>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-800">{selectedNote.title}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {selectedNote.updatedAt}
                  </span>
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {selectedNote.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Edit className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              {isEditing ? (
                <textarea
                  className="w-full h-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none"
                  defaultValue={selectedNote.content}
                />
              ) : (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700">
                    {selectedNote.content}
                  </pre>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <PenTool className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Sélectionnez une note pour la voir</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentNotesPage;
