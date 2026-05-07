import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

interface AssetOverrides {
  [key: string]: {
    url: string;
    isActive: boolean;
  };
}

interface Announcement {
  id: string;
  label: string;
  href: string;
  type: 'global' | 'subpage_app' | 'subpage_youtube';
  isActive: boolean;
  priority?: number;
}

interface AssetContextType {
  overrides: AssetOverrides;
  announcements: Announcement[];
  isLoading: boolean;
}

const AssetContext = createContext<AssetContextType>({
  overrides: {},
  announcements: [],
  isLoading: true,
});

export const useAssets = () => useContext(AssetContext);

export const AssetProvider = ({ children }: { children: ReactNode }) => {
  const [overrides, setOverrides] = useState<AssetOverrides>({});
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setIsLoading(false);
      return;
    }

    const pathAssets = 'assetOverrides';
    const pathAnnouncements = 'announcements';

    const qAssets = query(collection(db, pathAssets), where('isActive', '==', true));
    const qAnnouncements = query(collection(db, pathAnnouncements), where('isActive', '==', true));
    
    const unsubAssets = onSnapshot(qAssets, (snapshot) => {
      const newOverrides: AssetOverrides = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        newOverrides[data.assetKey] = {
          url: data.url,
          isActive: data.isActive
        };
      });
      setOverrides(newOverrides);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, pathAssets);
    });

    const unsubAnnouncements = onSnapshot(qAnnouncements, (snapshot) => {
      const newAnn: Announcement[] = [];
      snapshot.forEach((doc) => {
        newAnn.push({ id: doc.id, ...doc.data() } as Announcement);
      });
      setAnnouncements(newAnn);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, pathAnnouncements);
    });

    setIsLoading(false);

    return () => {
      unsubAssets();
      unsubAnnouncements();
    };
  }, []);

  return (
    <AssetContext.Provider value={{ overrides, announcements, isLoading }}>
      {children}
    </AssetContext.Provider>
  );
};
