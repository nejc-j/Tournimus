// src/store.ts
import { create } from 'zustand';
import { z } from 'zod';
import {
  GeneralInfoSchema,
  LocationTimeSchema,
  ParticipantsSchema,
} from './schemas';

type GeneralInfoData = z.infer<typeof GeneralInfoSchema>;
type LocationTimeData = z.infer<typeof LocationTimeSchema>;
type ParticipantsData = z.infer<typeof ParticipantsSchema>;

interface FormData {
  generalInfo: GeneralInfoData;
  locationTime: LocationTimeData;
  participants: ParticipantsData;
}

interface FormState {
  formData: FormData;
  updateGeneralInfo: (data: GeneralInfoData) => void;
  updateLocationTime: (data: LocationTimeData) => void;
  updateParticipants: (data: ParticipantsData) => void;

  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  resetSteps: () => void;
  setStep: (step: number) => void;
}

export const useFormStore = create<FormState>((set) => ({
  formData: {
    generalInfo: { tournamentName: '', presenter: '' },
    locationTime: {
      locationName: '',
      street: '',
      city: '',
      zipCode: '',
      numberOfCourts: 1,
      startTime: new Date(),
      matchDuration: 30,
      breakDuration: 5,
    },
    participants: { participants: [{ id: 1, name: '' }] },
  },

  updateGeneralInfo: (data) =>
    set((state) => ({
      formData: { ...state.formData, generalInfo: data },
    })),
  updateLocationTime: (data) =>
    set((state) => ({
      formData: { ...state.formData, locationTime: data },
    })),
  updateParticipants: (data) =>
    set((state) => ({
      formData: { ...state.formData, participants: data },
    })),

  // For Stepper form, to track steps
  currentStep: 0,
  totalSteps: 3,
  nextStep: () =>
    set((state) => ({
      currentStep:
        state.currentStep + 1 < state.totalSteps
          ? state.currentStep + 1
          : state.currentStep,
    })),
  prevStep: () =>
    set((state) => ({
      currentStep: state.currentStep - 1 >= 0 ? state.currentStep - 1 : 0,
    })),
  resetSteps: () =>
    set({
      currentStep: 0,
    }),
  setStep: (step) =>
    set({
      currentStep: step,
    }),
}));
