import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Assessment } from './types';

interface AppState {
  assessments: Assessment[];
  currentAssessment: Assessment | null;
  notificationsEnabled: boolean;
  reminderTime: string;
  units: 'metric' | 'imperial';
  addAssessment: (assessment: Assessment) => void;
  setCurrentAssessment: (assessment: Assessment | null) => void;
  toggleNotifications: () => void;
  setReminderTime: (time: string) => void;
  setUnits: (units: 'metric' | 'imperial') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      assessments: [],
      currentAssessment: null,
      notificationsEnabled: true,
      reminderTime: '9:00 AM',
      units: 'metric',
      addAssessment: (assessment) =>
        set((s) => ({
          assessments: [...s.assessments, assessment],
          currentAssessment: assessment,
        })),
      setCurrentAssessment: (assessment) =>
        set({ currentAssessment: assessment }),
      toggleNotifications: () =>
        set((s) => ({ notificationsEnabled: !s.notificationsEnabled })),
      setReminderTime: (time) => set({ reminderTime: time }),
      setUnits: (units) => set({ units }),
    }),
    {
      name: 'looksmaxing-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
