import Logo from './Logo';
import { Home } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import Footer from './Footer';

export default function Terms({ onBack }: { onBack: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-transparent">
      <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-white/5 py-4 mb-12 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
          <button onClick={onBack} className="cursor-pointer">
            <Logo />
          </button>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-amber-400 hover:text-amber-300 border border-white/10 rounded-xl transition-all shadow-lg shadow-amber-500/10 font-bold"
          >
            <Home size={18} />
            {t('back_to_home')}
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black text-brand-dark mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p>Welcome to Statistics By SG. By accessing our platform, you agree to comply with and be bound by the following terms and conditions.</p>
          
          <h2 className="text-xl font-bold text-brand-dark mt-8">1. Acceptance of Terms</h2>
          <p>By using this website, the "Statistics By SG" mobile app, and participating in our courses, you agree to these Terms of Service. If you do not agree, please refrain from using our services.</p>

          <h2 className="text-xl font-bold text-brand-dark mt-8">2. Intellectual Property</h2>
          <p>All content including video lectures, PDF notes, mock tests, and branding elements are the property of Statistics By SG. Unauthorized distribution or copying of this material is strictly prohibited.</p>

          <h2 className="text-xl font-bold text-brand-dark mt-8">3. Course Access</h2>
          <p>Course access is limited to a single registered user. Sharing account credentials will result in permanent termination of access without refund.</p>

          <h2 className="text-xl font-bold text-brand-dark mt-8">4. Limitation of Liability</h2>
          <p>While we strive for 100% selection rates, your performance in exams depends on individual effort. Statistics By SG is not liable for exam results.</p>
        </div>
      </div>
      <Footer onNavigate={onBack} isSecondary />
    </div>
  );
}
