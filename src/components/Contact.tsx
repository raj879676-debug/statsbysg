import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, MessageCircle, AlertCircle, CheckCircle2, Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured, handleFirestoreError, OperationType } from '../lib/firebase';

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Check if any field is empty
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.subject) newErrors.subject = 'Please select a subject';
    if (!formData.message.trim()) newErrors.message = 'Question/Doubt is required';

    // Phone validation (exactly 10 digits)
    if (formData.phone && formData.phone.length !== 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    // Email validation (@gmail.com)
    if (formData.email && !formData.email.toLowerCase().endsWith('@gmail.com')) {
      newErrors.email = 'A valid @gmail.com address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, mode: 'standard' | 'whatsapp' | 'gmail' = 'standard') => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setStatus('loading');
    setErrors({});

    try {
      const scriptURL = 'https://script.google.com/macros/s/AKfycbxIxTMHdKs_bHmBI3EN2NsMEb0WdctRu0wecfGBRtW3CWIb4T9NWc4rP9ne-Cg1uw/exec';
      const body = new URLSearchParams();
      (Object.keys(formData) as Array<keyof typeof formData>).forEach(key => {
        const val = key === 'phone' ? `+91${formData[key]}` : formData[key];
        body.append(key as string, val);
      });

      const bodyText = `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: +91 ${formData.phone}\nSubject: ${formData.subject}\nMessage: ${formData.message}`;

      // Firestore integration
      const path = 'contacts';
      if (isFirebaseConfigured && db) {
        try {
          await addDoc(collection(db, path), {
            ...formData,
            status: 'new',
            createdAt: serverTimestamp()
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, path);
        }
      }

      await fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      setStatus('success');
      
      if (mode === 'whatsapp') {
        const whatsappMessage = `*New Inquiry from Website*%0A%0A*Name:* ${encodeURIComponent(formData.name)}%0A*Phone:* ${encodeURIComponent('+91 ' + formData.phone)}%0A*Subject:* ${encodeURIComponent(formData.subject)}%0A*Message:* ${encodeURIComponent(formData.message)}`;
        window.open(`https://wa.me/919026914282?text=${whatsappMessage}`, '_blank');
      } else if (mode === 'gmail') {
        const subject = encodeURIComponent('Official Inquiry: ' + formData.subject);
        const mailBody = encodeURIComponent(bodyText);
        const gmailLink = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=statisticsbysg@gmail.com&su=${subject}&body=${mailBody}`;
        window.open(gmailLink, '_blank');
      }

      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="pt-6 md:pt-10 pb-8 md:pb-12 bg-transparent border-t border-slate-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-6xl font-black text-brand-dark mb-4 md:mb-6 tracking-tight italic"
          >
            {t('contact_title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg md:text-xl font-medium"
          >
            {t('contact_subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 p-10 md:p-14 rounded-[3rem] shadow-2xl border border-blue-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50/50 rounded-full translate-x-20 -translate-y-20 blur-3xl opacity-50" />
            
            <form onSubmit={(e) => handleSubmit(e, 'standard')} className="relative z-10 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('form_name')}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('form_name_placeholder')}
                    className={`w-full px-6 py-4 rounded-2xl border ${errors.name ? 'border-red-500 bg-red-50/10 text-red-900' : 'border-slate-200 bg-slate-100/80'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-bold placeholder:text-slate-400 shadow-sm`}
                  />
                  {errors.name && <p className="mt-1.5 text-[10px] text-red-600 font-bold uppercase tracking-wider flex items-center gap-1 ml-2"><AlertCircle size={10} /> {errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('form_phone')}</label>
                  <div className="relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center pr-3 border-r border-slate-200">
                      <span className="text-sm font-black text-brand-dark">+91</span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 10) {
                          setFormData({ ...formData, phone: val });
                        }
                      }}
                      placeholder="00000 00000"
                      className={`w-full pl-20 pr-6 py-4 rounded-2xl border ${errors.phone ? 'border-red-500 bg-red-50/10 text-red-900' : 'border-slate-200 bg-slate-100/50'} focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm font-black tracking-[0.1em] placeholder:text-slate-400`}
                    />
                  </div>
                  {errors.phone && <p className="mt-1.5 text-[10px] text-red-600 font-bold uppercase tracking-wider flex items-center gap-1 ml-2"><AlertCircle size={10} /> {errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('form_email')}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@gmail.com"
                  className={`w-full px-6 py-4 rounded-2xl border ${errors.email ? 'border-red-500 bg-red-50/10 text-red-900' : 'border-slate-200 bg-slate-100/50'} focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm font-bold placeholder:text-slate-400`}
                />
                {errors.email && <p className="mt-1.5 text-[10px] text-red-600 font-bold uppercase tracking-wider flex items-center gap-1 ml-2"><AlertCircle size={10} /> {errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('form_topic')}</label>
                <div className="relative">
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={`w-full px-6 py-4 rounded-2xl border ${errors.subject ? 'border-red-500 bg-red-50/10 text-red-900' : 'border-slate-200 bg-slate-100/50'} focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm font-bold appearance-none cursor-pointer placeholder:text-slate-400`}
                  >
                    <option value="" disabled className="text-slate-400">{t('form_subject_select')}</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="IIT-JAM STATISTICS">{t('form_option_jam')}</option>
                    <option value="Offline Batch Inquiry">{t('form_option_offline')}</option>
                    <option value="CSIR NET STATISTICS">{t('form_option_net')}</option>
                    <option value="BSC/BA STATISTICS">{t('form_option_grad')}</option>
                    <option value="UPSSSC ASO/ARO Inquiry">{t('form_option_aso')}</option>
                    <option value="GATE Statistics Batch">{t('form_option_gate')}</option>
                    <option value="ISS/RBI DSIM Inquiry">{t('form_option_iss')}</option>
                    <option value="Other (not mentioned)">Other (not mentioned)</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
                {errors.subject && <p className="mt-1.5 text-[10px] text-red-600 font-bold uppercase tracking-wider flex items-center gap-1 ml-2"><AlertCircle size={10} /> {errors.subject}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('form_message')}</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t('form_message_placeholder')}
                  className={`w-full px-6 py-4 rounded-2xl border ${errors.message ? 'border-red-500 bg-red-50/10 text-red-900' : 'border-slate-200 bg-slate-100/50'} focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm font-bold resize-none placeholder:text-slate-400`}
                ></textarea>
                {errors.message && <p className="mt-1.5 text-[10px] text-red-600 font-bold uppercase tracking-wider flex items-center gap-1 ml-2"><AlertCircle size={10} /> {errors.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  disabled={status === 'loading'}
                  onClick={(e) => handleSubmit(e, 'whatsapp')}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-xl transition-all ${
                    status === 'loading' ? 'bg-slate-200 text-slate-400' : 'bg-[#25D366] text-white shadow-[#25D366]/20 hover:bg-[#20ba5a]'
                  }`}
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{t('form_send_whatsapp')}</span>
                      <MessageCircle className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  disabled={status === 'loading'}
                  onClick={(e) => handleSubmit(e, 'gmail')}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-lg transition-all ${
                    status === 'loading' ? 'bg-slate-200 text-slate-400' : 'bg-white text-slate-900 border-2 border-slate-100 hover:border-brand-500 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-6 h-6 bg-red-600 rounded-lg flex items-center justify-center text-white">
                    <Mail size={12} />
                  </div>
                  <span>{t('form_send_gmail')}</span>
                </motion.button>
              </div>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-5 bg-green-500/5 border border-green-500/20 rounded-2xl flex items-center gap-4 text-green-700 text-xs font-black uppercase tracking-wider"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                      <CheckCircle2 size={16} />
                    </div>
                    <span>{t('form_success')}</span>
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-700 text-xs font-black uppercase tracking-wider"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center">
                      <AlertCircle size={16} />
                    </div>
                    <span>Error occurred. Please try again.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: <Phone size={24} />, label: t('contact_call'), value: '+91 90269 14282', href: 'tel:+919026914282', color: 'bg-blue-50 text-blue-600' },
                { icon: <MessageCircle size={24} />, label: t('contact_whatsapp'), value: '+91 90269 14282', href: 'https://wa.me/919026914282?text=Hello%21%20I%20have%20a%20query%20regarding%20Statistics%20coaching.', color: 'bg-green-50 text-green-600' },
              ].map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.href}
                  whileHover={{ y: -5 }}
                  className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 flex flex-col gap-6 group hover:border-blue-500 transition-all shadow-xl shadow-slate-300/20 relative overflow-hidden"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{item.label}</p>
                    <p className="text-lg font-black text-slate-900 tracking-tight">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="bg-slate-50 p-3 rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden aspect-video relative group">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.9979954634!2d80.93691667522288!3d26.871804776671674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd2c34096d99%3A0x138ee07fb9051a9f!2sSAMPOORNA%20LIBRARY%20AND%20CLASSES!5e0!3m2!1sen!2sin!4v1777570094434!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '2.5rem' }} 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <motion.a 
                href="https://www.google.com/maps/search/?api=1&query=D,+59,+Nirala+Nagar,Lucknow,Uttar+Pradesh+226020" 
                target="_blank" 
                rel="noopener noreferrer" 
                whileHover={{ y: -4 }}
                className="absolute bottom-8 left-8 right-8 p-5 bg-slate-50/95 backdrop-blur-md rounded-2xl border border-slate-100 shadow-2xl flex items-center gap-5 transition-all group-hover:shadow-brand-500/10"
              >
                <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-brand-500/20">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest mb-1">{t('contact_location')}</p>
                  <p className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                    {t('contact_address')}
                  </p>
                </div>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
