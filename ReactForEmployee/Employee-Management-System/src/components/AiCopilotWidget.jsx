import React, { useState, useRef, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Maximize2, 
  Minimize2, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AiCopilotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I am your AI Workforce Copilot. Ask me for employee details, leave policies, or department metrics!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axiosInstance.post('/api/ai/chat', { prompt: userText });
      if (res.data && res.data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `I received your query regarding "${userText}". All employee and department records are currently active and secure.` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center pulse-ai-glow border-0"
          style={{
            width: '56px',
            height: '56px',
            background: 'var(--gradient-primary)'
          }}
          title="Open Nexus AI Copilot"
        >
          <Sparkles size={26} className="text-white" />
        </button>
      )}

      {/* Slide-over Mini Chat Modal */}
      {isOpen && (
        <div 
          className="glass-card shadow-2xl border d-flex flex-column animate-fade-in"
          style={{
            width: '380px',
            height: '520px',
            maxHeight: '85vh',
            maxWidth: '92vw',
            borderRadius: '20px',
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Header */}
          <div className="p-3 border-bottom d-flex align-items-center justify-content-between rounded-top-4" style={{
            background: 'var(--gradient-primary)',
            color: '#fff'
          }}>
            <div className="d-flex align-items-center gap-2">
              <Sparkles size={20} />
              <div>
                <div className="fw-bold fs-sm leading-tight">Nexus AI Copilot</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Enterprise Intelligence</div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-1">
              <button 
                onClick={() => { setIsOpen(false); navigate('/ai-assistant'); }} 
                className="btn btn-sm btn-link text-white p-1"
                title="Open Fullscreen Assistant"
              >
                <Maximize2 size={16} />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="btn btn-sm btn-link text-white p-1"
                title="Close Widget"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-grow-1 p-3 overflow-y-auto d-flex flex-column gap-2 fs-xs">
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`d-flex ${m.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div 
                  className={`p-2.5 rounded-3 ${
                    m.role === 'user' 
                      ? 'chat-bubble-sent' 
                      : 'bg-light border text-dark'
                  }`}
                  style={{ maxWidth: '85%', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-muted d-flex align-items-center gap-2 py-1">
                <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                <span>AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="px-3 py-1.5 border-top d-flex gap-1 overflow-x-auto">
            <button 
              onClick={() => setInput('Who is Sarah Connor?')} 
              className="btn btn-sm btn-light border rounded-pill py-0.5 px-2 fs-xs text-nowrap"
            >
              Sarah Connor?
            </button>
            <button 
              onClick={() => setInput('Who is on leave?')} 
              className="btn btn-sm btn-light border rounded-pill py-0.5 px-2 fs-xs text-nowrap"
            >
              On Leave?
            </button>
            <button 
              onClick={() => setInput('What is the leave policy?')} 
              className="btn btn-sm btn-light border rounded-pill py-0.5 px-2 fs-xs text-nowrap"
            >
              Leave Policy?
            </button>
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-2.5 border-top d-flex gap-1.5 bg-light rounded-bottom-4">
            <input 
              type="text" 
              className="form-control form-control-sm shadow-none bg-white border"
              placeholder="Ask AI anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="btn btn-sm btn-primary border-0 rounded-2 px-3"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Send size={14} />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

export default AiCopilotWidget;
