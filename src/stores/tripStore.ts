import { create } from 'zustand';
import type { Trip, TripSettings } from '../types/trip';

interface TripState {
  // --- Data ---
  currentTrip: Trip | null;
  tripSettings: TripSettings | null;
  tripDetails: { time: string; distance: string; co2: string } | null;
  generatedStops: string[];
  
  // --- UI/Interaction State ---
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  
  // Controls which stops are currently shown (for the staggered animation effect)
  visibleStops: string[];
  
  // Persistent selection (clicked)
  selectedStop: string | null;
  
  // Transient selection (hovered)
  hoveredStop: string | null;
  
  // Mobile layout state
  isMobilePanelOpen: boolean;

  // --- Actions ---
  setTrip: (trip: Trip) => void;
  setTripSettings: (settings: TripSettings) => void;
  setTripDetails: (details: { time: string; distance: string; co2: string } | null) => void;
  
  setLoading: (loading: boolean) => void;
  setIsGenerating: (generating: boolean) => void;
  setError: (error: string | null) => void;
  
  setGeneratedStops: (stops: string[]) => void;
  setVisibleStops: (stops: string[]) => void;
  addVisibleStop: (stop: string) => void;
  
  setSelectedStop: (stop: string | null) => void;
  setHoveredStop: (stop: string | null) => void;
  setMobilePanelOpen: (isOpen: boolean) => void;
  
  clearTrip: () => void;
  resetGenerationState: () => void;
}

export const useTripStore = create<TripState>((set) => ({
  // Initial Data State
  currentTrip: null,
  tripSettings: null,
  tripDetails: null,
  generatedStops: [],
  
  // Initial UI State
  isLoading: false,
  isGenerating: false,
  error: null,
  visibleStops: [],
  selectedStop: null,
  hoveredStop: null,
  isMobilePanelOpen: true, // Default to open so user sees the form first

  // Actions
  setTrip: (trip) => set({ currentTrip: trip }),
  setTripSettings: (settings) => set({ tripSettings: settings }),
  setTripDetails: (details) => set({ tripDetails: details }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setError: (error) => set({ error }),
  
  setGeneratedStops: (stops) => set({ generatedStops: stops }),
  setVisibleStops: (stops) => set({ visibleStops: stops }),
  
  addVisibleStop: (stop) => set((state) => ({
    visibleStops: [...state.visibleStops, stop],
    // Auto-select the newly visible stop for a nicer flow
    selectedStop: stop
  })),
  
  setSelectedStop: (stop) => set({ selectedStop: stop }),
  setHoveredStop: (stop) => set({ hoveredStop: stop }),
  setMobilePanelOpen: (isOpen) => set({ isMobilePanelOpen: isOpen }),
  
  clearTrip: () => set({
    currentTrip: null,
    tripSettings: null,
    tripDetails: null,
    error: null,
    generatedStops: [],
    visibleStops: [],
    selectedStop: null,
    hoveredStop: null
  }),
  
  resetGenerationState: () => set({
    generatedStops: [],
    visibleStops: [],
    selectedStop: null,
    hoveredStop: null,
    isGenerating: true,
    tripDetails: null,
    isMobilePanelOpen: true // Keep panel open while generating so user sees progress
  }),
}));