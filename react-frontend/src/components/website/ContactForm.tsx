import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'General Inquiry',
    message: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        type: 'General Inquiry',
        message: ''
      });
    }, 1500);
  };
  return <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input type="text" required value={formData.name} onChange={e => setFormData({
          ...formData,
          name: e.target.value
        })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="John Doe" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input type="email" required value={formData.email} onChange={e => setFormData({
          ...formData,
          email: e.target.value
        })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Inquiry Type
          </label>
          <select value={formData.type} onChange={e => setFormData({
          ...formData,
          type: e.target.value
        })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white">
            <option>General Inquiry</option>
            <option>Technical Question</option>
            <option>Partnership</option>
            <option>Support</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea required rows={4} value={formData.message} onChange={e => setFormData({
          ...formData,
          message: e.target.value
        })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none" placeholder="How can we help you?" />
        </div>

        <button type="submit" disabled={status === 'submitting' || status === 'success'} className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${status === 'success' ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {status === 'submitting' ? <motion.div animate={{
          rotate: 360
        }} transition={{
          repeat: Infinity,
          duration: 1
        }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : status === 'success' ? <>
              <CheckCircle size={20} />
              Sent Successfully
            </> : <>
              Send Message
              <Send size={18} />
            </>}
        </button>

        {status === 'success' && <motion.p initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} className="text-center text-green-600 text-sm font-medium">
            Thank you! We'll get back to you shortly.
          </motion.p>}
      </div>
    </form>;
}