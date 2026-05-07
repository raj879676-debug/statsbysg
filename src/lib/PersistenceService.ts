import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export interface AppState {
  currentPage: string;
  classroomView: string;
}

export interface UserPreferences {
  language: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const STORAGE_KEYS = {
  APP_STATE: 'sankhikyi_app_state',
  PREFERENCES: 'sankhikyi_preferences',
  CHAT_HISTORY: 'sankhikyi_chat_history',
};

class PersistenceService {
  // --- Local Storage Fallbacks ---
  private saveToLocal(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Local storage save error:', e);
    }
  }

  private loadFromLocal(key: string) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Local storage load error:', e);
      return null;
    }
  }

  // --- Firestore Persistence ---
  async saveAppState(userId: string | null, state: AppState) {
    if (!userId || !db) {
      this.saveToLocal(STORAGE_KEYS.APP_STATE, state);
      return;
    }

    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, { 
        appState: state,
        updatedAt: serverTimestamp() 
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
    }
  }

  async loadAppState(userId: string | null): Promise<AppState | null> {
    if (!userId || !db) {
      return this.loadFromLocal(STORAGE_KEYS.APP_STATE);
    }

    try {
      const userRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists() && docSnap.data().appState) {
        return docSnap.data().appState as AppState;
      }
      return this.loadFromLocal(STORAGE_KEYS.APP_STATE);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${userId}`);
      return null;
    }
  }

  async saveChatHistory(userId: string | null, messages: ChatMessage[]) {
    if (!userId || !db) {
      this.saveToLocal(STORAGE_KEYS.CHAT_HISTORY, messages);
      return;
    }

    try {
      const chatRef = doc(db, 'chats', userId);
      await setDoc(chatRef, { 
        messages, 
        updatedAt: serverTimestamp() 
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `chats/${userId}`);
    }
  }

  async loadChatHistory(userId: string | null): Promise<ChatMessage[] | null> {
    if (!userId || !db) {
      return this.loadFromLocal(STORAGE_KEYS.CHAT_HISTORY);
    }

    try {
      const chatRef = doc(db, 'chats', userId);
      const docSnap = await getDoc(chatRef);
      if (docSnap.exists()) {
        return docSnap.data().messages as ChatMessage[];
      }
      return this.loadFromLocal(STORAGE_KEYS.CHAT_HISTORY);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `chats/${userId}`);
      return null;
    }
  }

  async savePreferences(userId: string | null, preferences: UserPreferences) {
    if (!userId || !db) {
      this.saveToLocal(STORAGE_KEYS.PREFERENCES, preferences);
      return;
    }

    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, { 
        preferences,
        updatedAt: serverTimestamp() 
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
    }
  }

  async loadPreferences(userId: string | null): Promise<UserPreferences | null> {
    if (!userId || !db) {
      return this.loadFromLocal(STORAGE_KEYS.PREFERENCES);
    }

    try {
      const userRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists() && docSnap.data().preferences) {
        return docSnap.data().preferences as UserPreferences;
      }
      return this.loadFromLocal(STORAGE_KEYS.PREFERENCES);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${userId}`);
      return null;
    }
  }
}

export const persistenceService = new PersistenceService();
