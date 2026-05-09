/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Home as HomeIcon, BookOpen, GraduationCap, School, ChevronRight, CheckCircle2, Youtube, Smartphone, MapPin, MessageSquare, Mail, Loader2 } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { useAssets } from '../lib/assetContext';
import Logo from './Logo';
import Footer from './Footer';
import GlobalAnnouncements from './GlobalAnnouncements';

interface ClassroomPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  initialView?: ViewType;
  onViewChange?: (view: ViewType) => void;
}

type ViewType = 'initial' | 'competitive' | 'university' | 'school';

const ClassroomPage = memo(({ onBack, onNavigate, initialView = 'initial', onViewChange }: ClassroomPageProps) => {
  const { t } = useLanguage();
  const { overrides } = useAssets();
  const [view, setView] = useState<ViewType>(initialView);

  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  const handleViewChange = (v: ViewType) => {
    setView(v);
    if (onViewChange) onViewChange(v);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // Initial Data
  const [statsCourses, setStatsCourses] = useState([
    "CSIR NET (Mathematical Sciences)",
    "UGC NET Statistics",
    "IIT-JAM Statistics",
    "GATE Statistics",
    "CUET Statistics"
  ]);

  const [mathCourses, setMathCourses] = useState([
    "CSIR NET (Mathematical Sciences)",
    "GATE Mathematics",
    "IIT-JAM Mathematics",
    "CUET Mathematics",
    "BSC MATHEMATICS",
    "MSC MATHEMATICS"
  ]);

  const [scienceCourses, setScienceCourses] = useState([
    "GATE Life Sciences",
    "CUET Biology"
  ]);

  const [csCourses, setCsCourses] = useState([
    "GATE Computer Science",
    "UGC NET Computer Science",
    "CUET Computer Science"
  ]);

  const uniLevels = ["BA", "BSC", "MA", "MSC"];
  const uniSubjects = ["Statistics", "Mathematics", "Physics", "Biology", "Chemistry", "Computer Sciences"];

  const schoolClasses = ["Class 9", "Class 10", "Class 11", "Class 12"];
  const schoolSubjects = ["Mathematics", "Physics", "Chemistry", "English", "Biology", "Computer Science"];

  const renderInitial = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
      {[
        { id: 'competitive', title: t('category_competitive'), icon: <GraduationCap className="w-8 h-8" />, desc: 'CSIR-NET, GATE, JAM, CUET & More' },
        { id: 'university', title: t('category_university'), icon: <BookOpen className="w-8 h-8" />, desc: 'BA, BSC, MA, MSC Semester Prep' },
        { id: 'school', title: t('category_school'), icon: <School className="w-8 h-8" />, desc: 'Foundation to Board Excellence (9th-12th)' }
      ].map((item) => (
        <motion.button
          key={item.id}
          whileHover={{ y: -10 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleViewChange(item.id as ViewType)}
          className="group relative bg-white p-10 rounded-[2.5rem] border-2 border-slate-100 hover:border-brand-500 transition-all text-left shadow-xl shadow-slate-200/50 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-brand-200">
              {item.icon}
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{item.title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-6">{item.desc}</p>
            <div className="inline-flex items-center gap-2 text-brand-600 font-bold group-hover:gap-4 transition-all">
              Explore Courses <ChevronRight size={18} />
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );

  const CourseList = ({ title, items }: { title: string, items: string[] }) => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h3 className="text-xl font-black text-brand-600 uppercase tracking-wider">{title}</h3>
        <div className="h-0.5 flex-grow bg-slate-100 rounded-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((course, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-brand-500 shrink-0" size={18} />
              <span className="text-slate-700 font-bold text-sm tracking-tight">{course}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCompetitive = () => (
    <div className="max-w-5xl mx-auto space-y-16 px-4">
      <CourseList title="Statistics" items={statsCourses} />
      <CourseList title="Mathematics" items={mathCourses} />
      <CourseList title="Physical & Life Sciences" items={scienceCourses} />
      <CourseList title="Computer Science" items={csCourses} />
    </div>
  );

  const renderUniversity = () => (
    <div className="max-w-6xl mx-auto px-4 space-y-12">
      <div className="text-center bg-white p-8 rounded-[2.5rem] border-2 border-brand-100 shadow-xl shadow-brand-50/50">
        <p className="text-slate-600 font-bold max-w-2xl mx-auto leading-relaxed text-sm md:text-lg">
          In <span className="text-brand-600 font-black italic">UNIVERSITY EXAM</span>, these courses are provided for all semesters 
          <span className="font-black text-slate-900 mx-2 scale-110 inline-block tracking-widest bg-slate-100 px-3 py-1 rounded-lg">I-VI</span> 
          in graduation level and 
          <span className="font-black text-slate-900 mx-2 scale-110 inline-block tracking-widest bg-slate-100 px-3 py-1 rounded-lg">I-IV</span> 
          in postgraduation level.
        </p>
      </div>

      <div className="space-y-8">
        {[
          { title: 'Graduation (UG)', levels: ['BA', 'BSC'] },
          { title: 'Post-Graduation (PG)', levels: ['MA', 'MSC'] }
        ].map((group) => (
          <div key={group.title} className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest pl-4 border-l-4 border-brand-500">{group.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {group.levels.map((level) => {
                const isScience = level === 'BSC' || level === 'MSC';
                const subjects = isScience 
                  ? uniSubjects 
                  : uniSubjects.filter(s => s === 'Statistics' || s === 'Mathematics');

                return (
                  <div key={level} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-20 h-20 bg-brand-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shrink-0">
                      {level}
                    </div>
                    <div className="flex-1 flex flex-wrap gap-4 justify-center md:justify-start">
                      {subjects.map((sub) => (
                        <div key={sub} className="px-6 py-4 bg-white rounded-2xl hover:bg-brand-50 transition-all cursor-default border-2 border-slate-100 shadow-md hover:shadow-brand-200 hover:border-brand-300 transform hover:-translate-y-1">
                          <span className="font-black text-slate-900 text-lg md:text-2xl uppercase tracking-tighter">{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSchool = () => (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {schoolClasses.map((cls) => (
          <div key={cls} className="bg-white p-8 rounded-3xl border-2 border-slate-100 hover:border-brand-200 transition-all shadow-lg hover:shadow-2xl">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black mb-6">
              {cls.split(' ')[1]}
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-widest">{cls}</h3>
            <div className="space-y-4">
              {schoolSubjects.map((sub) => (
                <div key={sub} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                  <span className="text-sm font-bold text-slate-600 tracking-tight">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    inquiryType: '',
    question: ''
  });

  const getInquiryOptions = () => {
    switch (view) {
      case 'competitive':
        return [
          "General Inquiry",
          ...statsCourses,
          ...mathCourses,
          ...scienceCourses,
          ...csCourses,
          "Other (not mentioned)"
        ].filter((v, i, a) => a.indexOf(v) === i); // Deduplicate
      case 'university':
        return [
          "General Inquiry",
          "BA Statistics",
          "BSC Statistics",
          "MA Statistics",
          "MSC Statistics",
          "Mathematics",
          "Physics",
          "Biology",
          "Chemistry",
          "Computer Sciences",
          "Other (not mentioned)"
        ];
      case 'school':
        return [
          "General Inquiry",
          "Class 9 Foundation",
          "Class 10 Foundation",
          "Class 11 Board Prep",
          "Class 12 Board Prep",
          "Other (not mentioned)"
        ];
      default:
        return ["General Inquiry", "Library Membership", "Demo Class", "Fee Structure", "Other (not mentioned)"];
    }
  };

  useEffect(() => {
    setForm(prev => ({ ...prev, inquiryType: getInquiryOptions()[0] }));
  }, [view]);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSend = async (channel: 'standard' | 'whatsapp' | 'gmail') => {
    if (!form.name.trim()) {
      alert("Please enter your Name.");
      return;
    }
    if (!form.mobile || form.mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!form.email || !form.email.toLowerCase().endsWith('@gmail.com')) {
      alert("A valid @gmail.com address is required.");
      return;
    }
    if (!form.inquiryType) {
      alert("Please select an Inquiry Type.");
      return;
    }
    if (!form.question.trim()) {
      alert("Please enter your Question or Doubt.");
      return;
    }

    setStatus('loading');

    const bodyText = `Name: ${form.name}
Email: ${form.email || 'Not provided'}
Mobile: +91 ${form.mobile}
Inquiry Type: ${form.inquiryType}
Question: ${form.question}`;

    try {
      const scriptURL = 'https://script.google.com/macros/s/AKfycbxIxTMHdKs_bHmBI3EN2NsMEb0WdctRu0wecfGBRtW3CWIb4T9NWc4rP9ne-Cg1uw/exec';
      const formData = new URLSearchParams();
      formData.append('name', form.name);
      formData.append('phone', `+91${form.mobile}`);
      formData.append('email', form.email || '');
      formData.append('subject', form.inquiryType);
      formData.append('message', form.question);

      await fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      setStatus('success');

      if (channel === 'whatsapp') {
        window.open(`https://wa.me/919026914282?text=${encodeURIComponent(bodyText)}`, '_blank');
      } else if (channel === 'gmail') {
        const subject = encodeURIComponent('Inquiry: ' + form.inquiryType);
        const mailBody = encodeURIComponent(bodyText);
        const gmailLink = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=statisticsbysg@gmail.com&su=${subject}&body=${mailBody}`;
        window.open(gmailLink, '_blank');
      }

      setForm({
        name: '',
        mobile: '',
        email: '',
        inquiryType: getInquiryOptions()[0],
        question: ''
      });

      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-transparent font-sans selection:bg-brand-100 selection:text-brand-900 pt-20 md:pt-32 pb-12 md:pb-20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={view === 'initial' ? onBack : () => handleViewChange('initial')}
              className="flex items-center gap-2 text-blue-400 font-black uppercase tracking-widest text-[9px] hover:text-blue-300 transition-colors group"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-colors bg-slate-800 shadow-lg">
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span className="hidden xs:block">{view === 'initial' ? 'Exit' : 'Back'}</span>
            </button>
            
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-amber-400 font-black uppercase tracking-widest text-[9px] hover:text-amber-300 transition-colors group"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl border border-white/10 flex items-center justify-center group-hover:border-amber-500/50 transition-colors bg-slate-800 shadow-lg">
                <HomeIcon size={14} />
              </div>
              <span className="hidden xs:block">Home</span>
            </button>
          </div>

          <div className="flex justify-end items-center gap-2 md:gap-4">
            <a 
              href="https://www.youtube.com/@statisticsbysg2247" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex flex-col items-center gap-0.5 transition-all"
            >
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-red-600 text-white shadow-lg shadow-red-200 group-hover:scale-110 transition-transform">
                <Youtube size={16} />
              </div>
            </a>
            <a 
              href="https://play.google.com/store/apps/details?id=co.khal.gdifh" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex flex-col items-center gap-0.5 transition-all"
            >
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-brand-600 text-white shadow-lg shadow-brand-200 group-hover:scale-110 transition-transform">
                <Smartphone size={16} />
              </div>
            </a>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16 mb-12 md:mb-20 text-center">
        <motion.div
   key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block w-full"
        >
          <div className="mb-6">
            <GlobalAnnouncements />
          </div>
          <a 
            href="https://www.google.com/maps/search/?api=1&query=D,+59,+Nirala+Nagar,Lucknow,Uttar+Pradesh+226020" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 md:px-6 py-2 bg-slate-900 text-white rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em] mb-6 md:mb-8 shadow-xl shadow-slate-200 hover:bg-brand-600 transition-colors group"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            <span className="hidden xs:inline">EXCELLENCE OFFLINE • </span> D, 59, Nirala Nagar, Lucknow
            <MapPin size={10} className="ml-1 text-brand-400" />
          </a>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-4">
            <div className="shrink-0 group relative">
               <Logo className="w-12 h-12 md:w-20 md:h-20 lg:w-24 lg:h-24" />
            </div>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-slate-950 leading-none tracking-tighter text-center md:text-left">
              {view === 'initial' && "Target Your Journey"}
              {view === 'competitive' && "Competitive Mastery"}
              {view === 'university' && "University Excellence"}
              {view === 'school' && "Foundation Success"}
            </h1>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 md:mb-8"
          >
            <h2 className="text-xl md:text-4xl font-black text-brand-600 tracking-[0.15em] md:tracking-[0.2em] uppercase italic relative inline-block">
              <span className="relative z-10">Classroom Prep</span>
              <div className="absolute -bottom-1 left-0 w-full h-[3px] bg-brand-200 rounded-full" />
            </h2>
          </motion.div>
          <p className="text-sm md:text-lg text-slate-500 font-medium max-w-2xl mx-auto px-4">
            {view === 'initial' && "Welcome to our Lucknow classroom center. Choose your focus area to see available programs and classroom facilities."}
            {(view === 'competitive' || view === 'university' || view === 'school') && "Personalized offline coaching with dedicated library access and doubt-solving sessions."}
          </p>
        </motion.div>
      </div>

      {/* Premium View Headers with Images */}
      <AnimatePresence mode="wait">
        {view !== 'initial' && (
          <motion.div
            key={`header-${view}`}
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="max-w-7xl mx-auto px-4 md:px-10 mb-16"
          >
            <div className="relative h-64 md:h-[450px] rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] border-4 border-white transform hover:scale-[1.01] transition-transform duration-700 group">
              <div className="absolute inset-0 bg-slate-900 animate-pulse" />
              <img 
                src={
                  view === 'competitive' ? (overrides['classroom_competitive_bg']?.url || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2000&auto=format&fit=crop") :
                  view === 'university' ? (overrides['classroom_university_bg']?.url || "https://images.unsplash.com/photo-1523050338392-069742301928?q=80&w=2000&auto=format&fit=crop") :
                  (overrides['classroom_school_bg']?.url || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2000&auto=format&fit=crop")
                }
                alt={view}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-10 md:p-16">
                <div className="max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3 mb-4"
                  >
                    <div className="w-12 h-[2px] bg-brand-500" />
                    <span className="px-5 py-2 bg-brand-500/10 backdrop-blur-md border border-brand-500/20 text-brand-400 rounded-full text-[11px] font-black uppercase tracking-[0.2em]">
                      {view === 'competitive' ? 'Premium Competitive' : view === 'university' ? 'Academic Mastery' : 'Foundation Excellence'}
                    </span>
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-7xl font-black text-white italic tracking-tighter leading-none mb-6"
                  >
                    {view === 'competitive' ? "Target India's Top Peaks" : view === 'university' ? "Excel in Your Degree" : "Strengthen Your Roots"}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-300 text-sm md:text-xl font-medium max-w-lg leading-relaxed"
                  >
                    {view === 'competitive' ? 'Premium coaching for IIT-JAM, GATE, CSIR-NET and government statistics examinations in Lucknow.' : 
                     view === 'university' ? 'Targeted semester support for BSc and MSc Statistics students from top Indian universities.' : 
                     'Holistic foundation in Mathematics and Statistics for Class 9 and 10 Board preparation.'}
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <div className="relative z-10 min-h-[300px] md:min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {view === 'initial' && renderInitial()}
            {view === 'competitive' && renderCompetitive()}
            {view === 'university' && renderUniversity()}
            {view === 'school' && renderSchool()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Inquiry Section */}
      <section className="mt-20 md:mt-40 max-w-7xl mx-auto px-4 md:px-6 pb-12 md:pb-20">
        <div className="bg-slate-950 rounded-[2.5rem] md:rounded-[4rem] p-6 sm:p-12 md:p-24 relative overflow-hidden shadow-2xl shadow-slate-900/40">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-600/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10">
            <div className="text-center mb-10 md:mb-20">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-brand-400 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.4em] mb-3 md:mb-4 block"
              >
                Direct Access to Excellence
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-7xl font-black text-white mb-4 md:mb-8 tracking-tighter leading-tight italic"
              >
                Personalized <br />
                <span className="text-brand-400 not-italic uppercase tracking-widest text-xl md:text-4xl">Counselling</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 font-medium text-sm md:text-xl max-w-2xl mx-auto leading-relaxed"
              >
                Ready to take the next step? Fill the form below and start your journey with offline coaching.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-20 items-stretch">
              <div className="space-y-6 md:space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Rahul Sharma"
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      className="w-full h-12 md:h-16 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-6 md:px-8 text-white text-sm font-bold placeholder:text-slate-600 focus:bg-white/10 focus:border-brand-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Mobile Number</label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center pr-4 border-r border-white/10">
                        <span className="text-sm font-black text-white">+91</span>
                      </div>
                      <input 
                        type="tel" 
                        maxLength={10}
                        placeholder="00000 00000"
                        value={form.mobile}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val.length <= 10) {
                            setForm({...form, mobile: val});
                          }
                        }}
                        className="w-full h-12 md:h-16 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl pl-20 pr-6 md:pr-8 text-white text-sm font-black tracking-[0.1em] placeholder:text-slate-600 focus:bg-white/10 focus:border-brand-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="name@gmail.com"
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      className="w-full h-12 md:h-16 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-6 md:px-8 text-white text-sm font-bold placeholder:text-slate-600 focus:bg-white/10 focus:border-brand-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Inquiry Type</label>
                    <div className="relative">
                      <select 
                        value={form.inquiryType}
                        onChange={(e) => setForm({...form, inquiryType: e.target.value})}
                        className="w-full h-12 md:h-16 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-6 md:px-8 text-white text-xs md:text-sm font-bold focus:bg-white/10 focus:border-brand-500 focus:outline-none appearance-none cursor-pointer transition-all"
                      >
                        {getInquiryOptions().map(opt => (
                          <option key={opt} value={opt} className="bg-slate-900 text-white">{opt}</option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Your Question / Doubt</label>
                  <textarea 
                    placeholder="Tell us about your learning goals and preferred timing for offline classes..."
                    rows={3}
                    value={form.question}
                    onChange={(e) => setForm({...form, question: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl md:rounded-[2.5rem] px-6 md:px-8 py-4 md:py-8 text-white text-sm font-bold placeholder:text-slate-600 focus:bg-white/10 focus:border-brand-500 focus:outline-none transition-all resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="bg-white/5 rounded-[2rem] md:rounded-[4rem] p-6 md:p-10 border border-white/10 flex flex-col justify-center backdrop-blur-sm mt-4 lg:mt-0">
                <div className="text-center mb-6 md:mb-10">
                  <span className="text-brand-400 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-3 block">Instant Connection</span>
                  <h3 className="text-xl md:text-3xl font-black text-white tracking-tight">Channel Selection</h3>
                </div>
                
                <div className="space-y-3 md:space-y-5">
                  {[
                    { id: 'whatsapp', label: 'Chat on WhatsApp', icon: <MessageSquare size={18} />, color: 'bg-[#25D366] hover:bg-[#20ba59] shadow-green-500/20' },
                    { id: 'gmail', label: 'Official Gmail', icon: <div className="w-6 h-6 bg-red-600 rounded-lg flex items-center justify-center text-white"><Mail size={12} /></div>, color: 'bg-white hover:bg-slate-100 text-slate-900 shadow-white/10' }
                  ].map((btn) => (
                    <motion.button
                      key={btn.id}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={status === 'loading'}
                      onClick={() => handleSend(btn.id as any)}
                      className={`w-full py-4 md:py-6 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-[9px] md:text-[10px] flex items-center justify-center gap-3 md:gap-4 shadow-2xl transition-all ${btn.color} ${status === 'loading' ? 'opacity-50 grayscale' : ''}`}
                    >
                      {status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : btn.icon}
                      {btn.label}
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence>
                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-6 md:mt-8 p-4 md:p-5 bg-green-500/10 border border-green-500/20 rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-4 text-green-400 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em]"
                    >
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
                        <CheckCircle2 size={12} className="md:size-4" />
                      </div>
                      <span>Inquiry logged successfully!</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8">
        <Footer onNavigate={onNavigate} hideMaterials={true} isSecondary={false} />
      </div>
    </div>
  );
});

ClassroomPage.displayName = 'ClassroomPage';

export default ClassroomPage;
