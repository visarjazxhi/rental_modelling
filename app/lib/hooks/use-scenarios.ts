'use client';

/**
 * Scenario Management Hook
 * 
 * Manages saving, loading, and comparing rental property scenarios
 * using localStorage for persistence.
 */

import { useState, useEffect, useCallback } from 'react';
import { PropertyModelInputs, DEFAULT_INPUTS } from '../types';

const STORAGE_KEY = 'rental-tax-scenarios';
const LAST_SESSION_KEY = 'rental-tax-last-session';

/**
 * Saved scenario structure
 */
export interface SavedScenario {
  id: string;
  name: string;
  inputs: PropertyModelInputs;
  createdAt: string;
  updatedAt: string;
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `scenario_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Hook for managing scenarios
 */
export function useScenarios() {
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load scenarios from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setScenarios(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Failed to load scenarios:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save scenarios to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
      } catch (error) {
        console.error('Failed to save scenarios:', error);
      }
    }
  }, [scenarios, isLoaded]);

  /**
   * Save current inputs as a new scenario
   */
  const saveScenario = useCallback((name: string, inputs: PropertyModelInputs): SavedScenario => {
    const now = new Date().toISOString();
    const newScenario: SavedScenario = {
      id: generateId(),
      name,
      inputs,
      createdAt: now,
      updatedAt: now,
    };
    
    setScenarios(prev => [...prev, newScenario]);
    return newScenario;
  }, []);

  /**
   * Update an existing scenario
   */
  const updateScenario = useCallback((id: string, inputs: PropertyModelInputs, name?: string) => {
    setScenarios(prev => prev.map(scenario => {
      if (scenario.id === id) {
        return {
          ...scenario,
          inputs,
          name: name ?? scenario.name,
          updatedAt: new Date().toISOString(),
        };
      }
      return scenario;
    }));
  }, []);

  /**
   * Delete a scenario
   */
  const deleteScenario = useCallback((id: string) => {
    setScenarios(prev => prev.filter(scenario => scenario.id !== id));
  }, []);

  /**
   * Get a scenario by ID
   */
  const getScenario = useCallback((id: string): SavedScenario | undefined => {
    return scenarios.find(scenario => scenario.id === id);
  }, [scenarios]);

  /**
   * Save last session state (auto-save)
   */
  const saveLastSession = useCallback((inputs: PropertyModelInputs) => {
    try {
      localStorage.setItem(LAST_SESSION_KEY, JSON.stringify(inputs));
    } catch (error) {
      console.error('Failed to save last session:', error);
    }
  }, []);

  /**
   * Load last session state
   */
  const loadLastSession = useCallback((): PropertyModelInputs | null => {
    try {
      const stored = localStorage.getItem(LAST_SESSION_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load last session:', error);
    }
    return null;
  }, []);

  /**
   * Clear last session
   */
  const clearLastSession = useCallback(() => {
    try {
      localStorage.removeItem(LAST_SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear last session:', error);
    }
  }, []);

  /**
   * Rename a scenario
   */
  const renameScenario = useCallback((id: string, newName: string) => {
    setScenarios(prev => prev.map(scenario => {
      if (scenario.id === id) {
        return {
          ...scenario,
          name: newName,
          updatedAt: new Date().toISOString(),
        };
      }
      return scenario;
    }));
  }, []);

  /**
   * Duplicate a scenario
   */
  const duplicateScenario = useCallback((id: string): SavedScenario | null => {
    const original = scenarios.find(s => s.id === id);
    if (!original) return null;
    
    const now = new Date().toISOString();
    const newScenario: SavedScenario = {
      id: generateId(),
      name: `${original.name} (Copy)`,
      inputs: JSON.parse(JSON.stringify(original.inputs)),
      createdAt: now,
      updatedAt: now,
    };
    
    setScenarios(prev => [...prev, newScenario]);
    return newScenario;
  }, [scenarios]);

  /**
   * Export all scenarios to JSON
   */
  const exportScenarios = useCallback((): string => {
    return JSON.stringify(scenarios, null, 2);
  }, [scenarios]);

  /**
   * Import scenarios from JSON
   */
  const importScenarios = useCallback((json: string, replace: boolean = false) => {
    try {
      const imported = JSON.parse(json);
      if (!Array.isArray(imported)) {
        throw new Error('Invalid format');
      }
      
      // Validate and regenerate IDs to avoid conflicts
      const validatedScenarios = imported.map(scenario => ({
        ...scenario,
        id: generateId(),
        inputs: scenario.inputs || DEFAULT_INPUTS,
        createdAt: scenario.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      
      if (replace) {
        setScenarios(validatedScenarios);
      } else {
        setScenarios(prev => [...prev, ...validatedScenarios]);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import scenarios:', error);
      return false;
    }
  }, []);

  return {
    scenarios,
    isLoaded,
    saveScenario,
    updateScenario,
    deleteScenario,
    getScenario,
    renameScenario,
    duplicateScenario,
    saveLastSession,
    loadLastSession,
    clearLastSession,
    exportScenarios,
    importScenarios,
  };
}

export default useScenarios;
