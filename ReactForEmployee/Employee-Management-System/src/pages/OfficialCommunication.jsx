import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../AuthContext';
import { 
  Send, 
  Hash, 
  User, 
  Users, 
  ShieldAlert, 
  Sparkles, 
  Search, 
  Bell, 
  Check, 
  CheckCheck, 
  Clock, 
  MessageSquare,
  AlertTriangle,
  FileCheck2,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';

const CHANNELS = [
  { id: 'general', name: 'general-announcements', desc: 'Company-wide notices & executive communications' },
  { id: 'engineering', name: 'engineering-team', desc: 'Technical design, releases & systems updates' },
  { id: 'hr', name: 'human-resources', desc: 'Workplace policy, benefits, and HR inquiries' },
  { id: 'design', name: 'product-design', desc: 'UX/UI reviews, brand assets, and design systems' },
  { id: 'finance', name: 'finance-approvals', desc: 'Expenses, budget allocations & payroll queries' }
];

const CATEGORIES = [
  { id: 'GENERAL', label: 'General', color: 'bg-secondary-subtle text-secondary' },
  { id: 'URGENT', label: 'Urgent', color: 'bg-danger-subtle text-danger' },
  { id: 'PROJECT', label: 'Project Update', color: 'bg-info-subtle text-info' },
  { id: 'HR_INQUIRY', label: 'HR Inquiry', color: 'bg-warning-subtle text-warning' },
  { id: 'ANNOUNCEMENT', label: 'Corporate Notice', color: 'bg-primary-subtle text-primary' }
];

const OfficialCommunication = () => {
  const { user } = useAuth();
  const location = useLocation();
  const messagesEndRef = useRef(null);

  // Active channel or recipient
  const [activeTab, setActiveTab] = useState('channel'); // 'channel' | 'direct'
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [selectedColleague, setSelectedColleague] = useState(null);

  const [colleagues, setColleagues] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('GENERAL');
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState('');

  // Handle URL query parameter ?user=username to immediately open DM
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const targetUser = params.get('user');
    if (targetUser && colleagues.length > 0) {
      const match = colleagues.find(c => c.username?.toLowerCase() === targetUser.toLowerCase());
      if (match) {
        setActiveTab('direct');
        setSelectedColleague(match);
      }
    }
  }, [location.search, colleagues]);

  // Fetch colleagues list
  const fetchColleagues = async () => {
    try {
      const res = await axiosInstance.get('/api/messages/colleagues');
      if (Array.isArray(res.data)) {
        setColleagues(res.data);
      }
    } catch (err) {
      console.warn("Colleague list fallback:", err);
      // Fallback sample colleagues if offline
      setColleagues([
        { employeeId: 1, name: 'Sarah Connor', role: 'Principal Engineer', dept: 'Engineering', username: 'sarah' },
        { employeeId: 2, name: 'Alexander Wright', role: 'Senior FullStack Developer', dept: 'Engineering', username: 'alex' },
        { employeeId: 3, name: 'Elena Rostova', role: 'HR Lead Manager', dept: 'Human Resources', username: 'elena' },
        { employeeId: 4, name: 'David Kim', role: 'UI/UX Designer', dept: 'Design', username: 'david' }
      ]);
    }
  };

  useEffect(() => {
    fetchColleagues();
  }, []);

  // Fetch conversation messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      if (activeTab === 'channel') {
        const res = await axiosInstance.get(`/api/messages/channel/${selectedChannel}`);
        if (Array.isArray(res.data)) {
          setMessages(res.data);
        }
      } else if (activeTab === 'direct' && selectedColleague) {
        const currentUsername = user?.username || 'admin';
        const targetUsername = selectedColleague.username;
        const res = await axiosInstance.get(`/api/messages/direct?user1=${currentUsername}&user2=${targetUsername}`);
        if (Array.isArray(res.data)) {
          setMessages(res.data);
        }
      }
    } catch (err) {
      console.warn("Message fetch fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [activeTab, selectedChannel, selectedColleague]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const currentUsername = user?.username || 'admin';
    const currentName = user?.name || 'Administrator';
    const currentRole = user?.role === 'ROLE_ADMIN' ? 'Administrator' : (user?.role === 'ROLE_MANAGER' ? 'Manager' : 'Employee');

    const newMsg = {
      senderUsername: currentUsername,
      senderName: currentName,
      senderRole: currentRole,
      recipientUsername: activeTab === 'channel' ? 'ALL' : selectedColleague.username,
      recipientName: activeTab === 'channel' ? selectedChannel : selectedColleague.name,
      channel: activeTab === 'channel' ? selectedChannel : null,
      category: selectedCategory,
      content: inputText.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      const res = await axiosInstance.post('/api/messages/send', newMsg);
      if (res.data) {
        setMessages(prev => [...prev, res.data]);
      } else {
        setMessages(prev => [...prev, { ...newMsg, id: Date.now() }]);
      }
      setInputText('');
    } catch (err) {
      console.warn("Send message fallback:", err);
      setMessages(prev => [...prev, { ...newMsg, id: Date.now() }]);
      setInputText('');
    }
  };

  const filteredColleagues = colleagues.filter(c => {
    // Exclude current user from DM list
    if (c.username && user?.username && c.username.toLowerCase() === user.username.toLowerCase()) {
      return false;
    }
    return (
      (c.name || '').toLowerCase().includes(searchUser.toLowerCase()) ||
      (c.dept || '').toLowerCase().includes(searchUser.toLowerCase()) ||
      (c.role || '').toLowerCase().includes(searchUser.toLowerCase())
    );
  });

  return (
    <div className="container-fluid px-4 py-3 animate-fade-in">
      
      {/* Top Banner */}
      <div className="glass-card p-3 p-md-4 mb-3 border-0 shadow-sm d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)'
      }}>
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-3 p-2.5 text-white d-flex align-items-center justify-content-center shadow-md" style={{
            background: 'var(--gradient-primary)',
            width: '46px',
            height: '46px'
          }}>
            <MessageSquare size={24} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h4 className="fw-bold mb-0">Official Employee Communications</h4>
              <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle fs-xs">
                Encrypted & Logged
              </span>
            </div>
            <p className="text-muted fs-xs mb-0">
              Corporate official channels, department discussions, and 1-on-1 direct employee correspondence.
            </p>
          </div>
        </div>

        <button 
          onClick={fetchMessages} 
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1.5 rounded-3 align-self-start align-self-md-auto"
          title="Refresh Messages"
        >
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Feed
        </button>
      </div>

      {/* Main Communication Grid */}
      <div className="row g-3">
        
        {/* Left Column: Channels & Colleagues Roster */}
        <div className="col-12 col-md-4 col-xl-3">
          <div className="glass-card p-3 border-0 shadow-sm h-100 d-flex flex-column" style={{ minHeight: '580px' }}>
            
            {/* Section 1: Department Channels */}
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fs-xs fw-bold text-uppercase text-muted tracking-wider">
                  Official Channels
                </span>
                <span className="badge bg-light text-muted border fs-xs">{CHANNELS.length}</span>
              </div>
              <div className="d-flex flex-column gap-1">
                {CHANNELS.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => { setActiveTab('channel'); setSelectedChannel(ch.id); }}
                    className={`btn btn-sm text-start py-2 px-2.5 rounded-3 border-0 transition-all d-flex align-items-center gap-2 ${
                      activeTab === 'channel' && selectedChannel === ch.id 
                        ? 'chat-channel-active' 
                        : 'text-secondary hover-bg-light'
                    }`}
                  >
                    <Hash size={16} className={activeTab === 'channel' && selectedChannel === ch.id ? 'text-primary' : 'text-muted'} />
                    <span className="text-truncate fs-sm">{ch.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 2: Direct Messages */}
            <div className="flex-grow-1 d-flex flex-column">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fs-xs fw-bold text-uppercase text-muted tracking-wider">
                  Direct Messages
                </span>
                <span className="badge bg-light text-muted border fs-xs">{filteredColleagues.length}</span>
              </div>

              {/* Search colleague */}
              <div className="input-group input-group-sm mb-2">
                <span className="input-group-text bg-transparent border-end-0 text-muted"><Search size={14} /></span>
                <input 
                  type="text" 
                  className="form-control border-start-0 ps-0 shadow-none bg-transparent fs-xs" 
                  placeholder="Find colleague..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                />
              </div>

              {/* Colleague list */}
              <div className="d-flex flex-column gap-1 overflow-y-auto" style={{ maxHeight: '300px' }}>
                {filteredColleagues.map(colleague => (
                  <button
                    key={colleague.employeeId || colleague.username}
                    onClick={() => { setActiveTab('direct'); setSelectedColleague(colleague); }}
                    className={`btn btn-sm text-start py-2 px-2.5 rounded-3 border-0 transition-all d-flex align-items-center justify-content-between ${
                      activeTab === 'direct' && selectedColleague?.username === colleague.username
                        ? 'chat-channel-active'
                        : 'text-secondary hover-bg-light'
                    }`}
                  >
                    <div className="d-flex align-items-center gap-2 text-truncate">
                      <div className="position-relative">
                        <img 
                          src={colleague.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(colleague.name)}&background=6366f1&color=fff`} 
                          alt={colleague.name}
                          className="rounded-circle object-fit-cover"
                          style={{ width: '28px', height: '28px' }}
                        />
                        <span className="position-absolute bottom-0 end-0 online-dot"></span>
                      </div>
                      <div className="text-truncate">
                        <div className="fw-semibold fs-xs text-truncate">{colleague.name}</div>
                        <div className="text-muted fs-xs text-truncate" style={{ fontSize: '0.7rem' }}>{colleague.role || colleague.dept}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

            </div>

          </div>
        </div>

        {/* Right Column: Chat Header, Messages Feed & Input */}
        <div className="col-12 col-md-8 col-xl-9">
          <div className="glass-card border-0 shadow-sm d-flex flex-column" style={{ minHeight: '580px', height: 'calc(100vh - 220px)' }}>
            
            {/* Chat Thread Header */}
            <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-light rounded-top-4">
              <div className="d-flex align-items-center gap-2">
                {activeTab === 'channel' ? (
                  <>
                    <div className="rounded-2 p-1.5 bg-primary-subtle text-primary">
                      <Hash size={18} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">
                        #{CHANNELS.find(c => c.id === selectedChannel)?.name || selectedChannel}
                      </h6>
                      <div className="text-muted fs-xs">
                        {CHANNELS.find(c => c.id === selectedChannel)?.desc}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <img 
                      src={selectedColleague?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedColleague?.name || 'User')}&background=6366f1&color=fff`}
                      alt={selectedColleague?.name}
                      className="rounded-circle object-fit-cover"
                      style={{ width: '36px', height: '36px' }}
                    />
                    <div>
                      <h6 className="fw-bold mb-0">{selectedColleague?.name || 'Direct Conversation'}</h6>
                      <div className="text-muted fs-xs">
                        {selectedColleague?.role} &bull; {selectedColleague?.dept}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success-subtle text-success fs-xs border border-success-subtle">
                  ● Official Thread
                </span>
              </div>
            </div>

            {/* Messages Feed Area */}
            <div className="flex-grow-1 p-3 p-md-4 overflow-y-auto d-flex flex-column gap-3">
              {messages.length === 0 ? (
                <div className="m-auto text-center py-5 text-muted">
                  <MessageSquare size={36} className="text-muted mb-2 d-block mx-auto" />
                  <div className="fw-semibold">No messages yet in this official thread.</div>
                  <div className="fs-xs">Be the first to share an official project update or announcement.</div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMe = msg.senderUsername && user?.username && msg.senderUsername.toLowerCase() === user.username.toLowerCase();
                  const categoryMeta = CATEGORIES.find(c => c.id === msg.category) || CATEGORIES[0];

                  return (
                    <div 
                      key={msg.id || index} 
                      className={`d-flex flex-column ${isMe ? 'align-items-end' : 'align-items-start'}`}
                    >
                      {/* Sender Meta */}
                      <div className="d-flex align-items-center gap-2 mb-1 px-1 fs-xs">
                        <span className="fw-semibold text-dark">{msg.senderName || msg.senderUsername}</span>
                        {msg.senderRole && (
                          <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                            ({msg.senderRole})
                          </span>
                        )}
                        <span className={`badge-official ${categoryMeta.color}`}>
                          {categoryMeta.label}
                        </span>
                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                          {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>

                      {/* Bubble */}
                      <div 
                        className={`p-3 fs-sm ${isMe ? 'chat-bubble-sent' : 'chat-bubble-received'}`}
                        style={{ maxWidth: '80%', lineHeight: '1.5' }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Toolbar */}
            <div className="p-3 border-top bg-light rounded-bottom-4">
              
              {/* Category Selector */}
              <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <span className="fs-xs text-muted fw-semibold">Official Tag:</span>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`btn btn-sm py-0.5 px-2 rounded-pill fs-xs border transition-all ${
                      selectedCategory === cat.id 
                        ? 'btn-primary border-primary text-white fw-semibold' 
                        : 'bg-white text-secondary'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="d-flex align-items-center gap-2">
                <input 
                  type="text" 
                  className="form-control shadow-none bg-white rounded-3 py-2 px-3 fs-sm"
                  placeholder={
                    activeTab === 'channel' 
                      ? `Post official notice to #${CHANNELS.find(c => c.id === selectedChannel)?.name}...` 
                      : `Send message to ${selectedColleague?.name || 'colleague'}...`
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button 
                  type="submit" 
                  disabled={!inputText.trim()}
                  className="btn btn-primary rounded-3 px-3.5 py-2 d-flex align-items-center gap-1.5 fw-semibold border-0 shadow-sm"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  <Send size={16} />
                  <span className="d-none d-sm-inline">Send</span>
                </button>
              </form>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default OfficialCommunication;
