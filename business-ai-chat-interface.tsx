import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Menu, X, FileText, Image, Download, Share2, Edit3, Mail, Folder, Eye, Bot, User, Plus, Settings, Search, Filter, ChevronLeft, ChevronRight, Maximize2, Copy, Trash2, RefreshCw } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      agent: 'Agent Devis',
      type: 'agent',
      content: 'Bonjour! Je suis prêt à vous aider avec vos devis.',
      timestamp: new Date(),
      documents: []
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('Agent Devis');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const agents = [
    { name: 'Agent Devis', icon: '💼', status: 'en ligne', color: 'bg-blue-500' },
    { name: 'Agent Comptabilité', icon: '📊', status: 'en ligne', color: 'bg-green-500' },
    { name: 'Agent Marketing', icon: '📈', status: 'hors ligne', color: 'bg-purple-500' },
    { name: 'Agent Support', icon: '🎧', status: 'en ligne', color: 'bg-orange-500' },
    { name: 'Agent RH', icon: '👥', status: 'occupé', color: 'bg-pink-500' }
  ];

  const documentActions = [
    { icon: Eye, label: 'Visualiser', action: 'view' },
    { icon: Edit3, label: 'Modifier', action: 'edit' },
    { icon: Share2, label: 'Partager', action: 'share' },
    { icon: Mail, label: 'Envoyer par email', action: 'email' },
    { icon: Download, label: 'Télécharger', action: 'download' },
    { icon: Folder, label: 'Ranger', action: 'file' },
    { icon: Copy, label: 'Dupliquer', action: 'copy' },
    { icon: Trash2, label: 'Supprimer', action: 'delete' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() || selectedFile) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        content: inputMessage,
        timestamp: new Date(),
        documents: selectedFile ? [{
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          url: URL.createObjectURL(selectedFile)
        }] : []
      };
      
      setMessages([...messages, newMessage]);
      setInputMessage('');
      setSelectedFile(null);
      
      // Simuler une réponse de l'agent
      setTimeout(() => {
        const agentResponse = {
          id: messages.length + 2,
          agent: selectedAgent,
          type: 'agent',
          content: generateAgentResponse(selectedAgent, inputMessage),
          timestamp: new Date(),
          documents: Math.random() > 0.5 ? [{
            name: 'Devis_2024_001.pdf',
            type: 'application/pdf',
            preview: '📄',
            actions: true
          }] : []
        };
        setMessages(prev => [...prev, agentResponse]);
      }, 1000);
    }
  };

  const generateAgentResponse = (agent, message) => {
    const responses = {
      'Agent Devis': 'J\'ai analysé votre demande. Je prépare le devis correspondant avec les spécifications mentionnées.',
      'Agent Comptabilité': 'Je traite les données financières. Le rapport sera disponible dans quelques instants.',
      'Agent Marketing': 'J\'analyse les tendances du marché pour votre secteur. Voici mes recommandations.',
      'Agent Support': 'Je comprends votre problème. Voici la solution que je propose.',
      'Agent RH': 'J\'ai examiné votre requête RH. Voici les informations demandées.'
    };
    return responses[agent] || 'Message reçu. Je traite votre demande.';
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDocumentAction = (action, document) => {
    switch(action) {
      case 'view':
        setSelectedDocument(document);
        setShowDocumentViewer(true);
        break;
      case 'email':
        alert(`Envoi de ${document.name} par email...`);
        break;
      case 'download':
        alert(`Téléchargement de ${document.name}...`);
        break;
      case 'share':
        alert(`Partage de ${document.name}...`);
        break;
      default:
        alert(`Action ${action} sur ${document.name}`);
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (msg.agent && msg.agent.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative w-80 h-full bg-white shadow-xl transition-transform duration-300 z-30`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Agents IA</h2>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un agent..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
            <Plus className="w-4 h-4" />
            Nouvel Agent
          </button>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          {agents.map((agent) => (
            <div
              key={agent.name}
              onClick={() => setSelectedAgent(agent.name)}
              className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedAgent === agent.name ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className={`w-12 h-12 ${agent.color} rounded-full flex items-center justify-center text-2xl`}>
                {agent.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{agent.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${
                    agent.status === 'en ligne' ? 'bg-green-500' : 
                    agent.status === 'occupé' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}></span>
                  {agent.status}
                </p>
              </div>
              <Settings className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
                <Menu className="w-6 h-6" />
              </button>
              <Bot className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-lg font-semibold">{selectedAgent}</h1>
                <p className="text-sm text-gray-500">Assistant IA professionnel</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredMessages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className="flex items-start gap-3">
                  {message.type === 'agent' && (
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                  )}
                  
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white border shadow-sm'
                  }`}>
                    {message.agent && message.type === 'agent' && (
                      <p className="text-xs font-semibold text-blue-600 mb-1">{message.agent}</p>
                    )}
                    <p className={message.type === 'user' ? 'text-white' : 'text-gray-800'}>
                      {message.content}
                    </p>
                    
                    {message.documents && message.documents.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.documents.map((doc, idx) => (
                          <div key={idx} className={`rounded-lg p-3 ${
                            message.type === 'user' ? 'bg-blue-600' : 'bg-gray-50'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {doc.type?.includes('image') ? (
                                  <Image className="w-5 h-5" />
                                ) : (
                                  <FileText className="w-5 h-5" />
                                )}
                                <span className={`text-sm font-medium ${
                                  message.type === 'user' ? 'text-white' : 'text-gray-700'
                                }`}>
                                  {doc.name}
                                </span>
                              </div>
                              
                              {doc.actions && (
                                <div className="flex gap-1">
                                  {documentActions.slice(0, 3).map((action) => (
                                    <button
                                      key={action.action}
                                      onClick={() => handleDocumentAction(action.action, doc)}
                                      className="p-1 hover:bg-blue-100 rounded transition-colors"
                                      title={action.label}
                                    >
                                      <action.icon className="w-4 h-4 text-blue-600" />
                                    </button>
                                  ))}
                                  <div className="relative group">
                                    <button className="p-1 hover:bg-blue-100 rounded transition-colors">
                                      <ChevronRight className="w-4 h-4 text-blue-600" />
                                    </button>
                                    <div className="absolute right-0 top-8 bg-white shadow-lg rounded-lg p-2 hidden group-hover:block z-10 w-48">
                                      {documentActions.slice(3).map((action) => (
                                        <button
                                          key={action.action}
                                          onClick={() => handleDocumentAction(action.action, doc)}
                                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded text-sm"
                                        >
                                          <action.icon className="w-4 h-4" />
                                          {action.label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <p className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-4">
          {selectedFile && (
            <div className="mb-3 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">{selectedFile.name}</span>
                <span className="text-xs text-blue-600">
                  ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <div className="flex items-end gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            />
            
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Tapez votre message..."
                className="w-full px-4 py-3 pr-12 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="1"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            
            <button
              onClick={handleSendMessage}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {showDocumentViewer && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{selectedDocument.name}</h3>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Maximize2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowDocumentViewer(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-8 overflow-auto bg-gray-50">
              <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-2xl font-bold mb-4">Aperçu du document</h1>
                <p className="text-gray-600 mb-4">
                  Ceci est un aperçu du document {selectedDocument.name}. 
                  Dans une application réelle, le contenu du document serait affiché ici.
                </p>
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-24 h-24 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-between">
              <div className="flex gap-2">
                {documentActions.map((action) => (
                  <button
                    key={action.action}
                    onClick={() => handleDocumentAction(action.action, selectedDocument)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <action.icon className="w-4 h-4" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;