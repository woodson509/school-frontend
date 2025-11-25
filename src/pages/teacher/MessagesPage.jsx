/**
 * Teacher Messages Page
 * Communication with students and parents
 */

import { useState } from 'react';
import { MessageSquare, Search, Send, Paperclip, Users, User } from 'lucide-react';

const TeacherMessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  
  const conversations = [
    { id: 1, name: 'Jean Pierre', role: 'Étudiant - 6ème A', lastMessage: 'Merci pour les explications!', time: '10:30', unread: 0, online: true },
    { id: 2, name: 'Mme Pierre', role: 'Parent de Jean', lastMessage: 'Comment va mon fils en maths?', time: '09:15', unread: 2, online: false },
    { id: 3, name: 'Marie Claire', role: 'Étudiant - 6ème A', lastMessage: 'Je n\'ai pas compris l\'exercice 5', time: 'Hier', unread: 1, online: true },
    { id: 4, name: 'M. Durand', role: 'Parent de Sophie', lastMessage: 'Ma fille sera absente demain', time: 'Hier', unread: 0, online: false },
  ];

  return (
    <div className="h-[calc(100vh-200px)] flex bg-white rounded-xl shadow-sm overflow-hidden">
      <div className={`w-80 border-r flex flex-col ${selectedConversation ? 'hidden md:flex' : ''}`}>
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedConversation?.id === conv.id ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                    {conv.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {conv.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800 truncate">{conv.name}</h3>
                    <span className="text-xs text-gray-400">{conv.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{conv.role}</p>
                  <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b flex items-center gap-3">
            <button onClick={() => setSelectedConversation(null)} className="md:hidden">←</button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
              {selectedConversation.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{selectedConversation.name}</h3>
              <p className="text-xs text-gray-500">{selectedConversation.online ? 'En ligne' : 'Hors ligne'}</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Messages here */}
          </div>
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              <input
                type="text"
                placeholder="Écrire un message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-full"
              />
              <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Sélectionnez une conversation</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherMessagesPage;
