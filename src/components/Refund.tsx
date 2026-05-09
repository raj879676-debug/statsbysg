import Logo from './Logo';
import { Home } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import Footer from './Footer';

export default function Refund({ onBack }: { onBack: () => void }) {
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
        <div className="bg-slate-50 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">
          <h1 className="text-4xl font-black text-brand-dark mb-8">Refund Policy</h1>
          
          <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
            <p>At Statistics By SG, we provide high-quality education and premium resources. Please read our refund policy below before making any purchase.</p>
            
            <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100">
              <h2 className="text-xl font-bold text-brand-dark">No Refund Policy</h2>
              <p className="mt-2 text-brand-900">Due to the digital nature of our courses and instant access to downloadable PDF notes, all purchases made on the Statistics By SG app or website are non-refundable.</p>
            </div>

            <h2 className="text-xl font-bold text-brand-dark mt-8">Subscription Changes</h2>
            <p>If you have accidentally purchased the wrong course, contact support within 24 hours of purchase. We may, at our sole discretion, transfer your enrollment to the intended course.</p>

            <h2 className="text-xl font-bold text-brand-dark mt-8">Technical Errors</h2>
            <p>If a payment is deducted but access is not granted, please wait for 24 hours for automatic reconciliation or email us at statisticsbysg@gmail.com with your transaction details.</p>
          </div>
        </div>
      </div>
      <Footer onNavigate={onBack} isSecondary />
    </div>
  );
}
