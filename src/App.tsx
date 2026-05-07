/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { LanguageProvider } from './lib/LanguageContext';
import { AssetProvider } from './lib/assetContext';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { persistenceService } from './lib/PersistenceService';
import { Loader2 } from 'lucide-react';
import Home from './components/Home';
import GlobalAnnouncements from './components/GlobalAnnouncements';
import ScrollControls from './components/ScrollControls';
import LanguageToggle from './components/LanguageToggle';

const Terms = lazy(() => import('./components/Terms'));
const Refund = lazy(() => import('./components/Refund'));
const ClassroomPage = lazy(() => import('./components/ClassroomPage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
  </div>
);

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [classroomView, setClassroomView] = useState<'initial' | 'competitive' | 'university' | 'school'>('initial');
  const [isReady, setIsReady] = useState(false);

  // Load state on mount
  useEffect(() => {
    const loadState = async () => {
      const savedState = await persistenceService.loadAppState(user?.uid || null);
      if (savedState) {
        setCurrentPage(savedState.currentPage);
        if (savedState.classroomView) {
          setClassroomView(savedState.classroomView as any);
        }
      }
      setIsReady(true);
    };
    loadState();
  }, [user?.uid]);

  // Save state on change
  useEffect(() => {
    if (isReady) {
      persistenceService.saveAppState(user?.uid || null, { 
        currentPage, 
        classroomView 
      });
    }
  }, [currentPage, classroomView, user?.uid, isReady]);

  useEffect(() => {
    // Handle browser back/forward buttons
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
        if (event.state.view) {
          setClassroomView(event.state.view);
        }
      } else {
        setCurrentPage('home');
        setClassroomView('initial');
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Initialize state
    window.history.replaceState({ page: 'home', view: 'initial' }, '');

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, classroomView]);

  const navigateTo = useCallback((page: string, view: string = 'initial') => {
    if (page !== currentPage || (page === 'classroom' && view !== classroomView)) {
      window.history.pushState({ page, view }, '');
      setCurrentPage(page);
      if (page === 'classroom') {
        setClassroomView(view as any);
      }
    }
  }, [currentPage, classroomView]);

  const renderContent = () => {
    if (!isReady) return <PageLoader />;

    if (currentPage === 'terms') {
      return (
        <Suspense fallback={<PageLoader />}>
          <Terms onBack={() => navigateTo('home')} />
        </Suspense>
      );
    }

    if (currentPage === 'refund') {
      return (
        <Suspense fallback={<PageLoader />}>
          <Refund onBack={() => navigateTo('home')} />
        </Suspense>
      );
    }

    if (currentPage === 'classroom') {
      return (
        <Suspense fallback={<PageLoader />}>
          <ClassroomPage 
            onBack={() => navigateTo('home')} 
            onNavigate={navigateTo}
            initialView={classroomView}
            onViewChange={(v) => navigateTo('classroom', v)}
          />
        </Suspense>
      );
    }

    return <Home onNavigate={navigateTo} />;
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="flex-1">
        {renderContent()}
      </div>
      <ScrollControls currentPage={currentPage} onBack={() => currentPage !== 'home' && window.history.back()} />
      <LanguageToggle />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AssetProvider>
          <AppContent />
        </AssetProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

