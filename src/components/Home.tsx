import { Suspense, lazy } from 'react';
import Announcement from './Announcement';
import Navbar from './Navbar';
import Hero from './Hero';
import Courses from './Courses';
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';
import StatisticalBackground from './StatisticalBackground';

const YouTubeGallery = lazy(() => import('./YouTubeGallery'));
const Testimonials = lazy(() => import('./Testimonials'));
const AppShowcase = lazy(() => import('./AppShowcase'));
const About = lazy(() => import('./About'));
const OfflineClasses = lazy(() => import('./OfflineClasses'));
const Contact = lazy(() => import('./Contact'));
const Footer = lazy(() => import('./Footer'));

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="relative">
          <div className="hidden lg:block">
            <StatisticalBackground />
          </div>
          <Hero />
        </div>
        <Courses />
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>}>
          <OfflineClasses onNavigate={onNavigate} />
        </Suspense>
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>}>
          <YouTubeGallery />
        </Suspense>
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>}>
          <AppShowcase />
        </Suspense>
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>}>
          <About />
        </Suspense>
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>}>
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={<div className="h-40 bg-brand-dark" />}>
        <Footer onNavigate={onNavigate} />
      </Suspense>
    </div>
  );
}
