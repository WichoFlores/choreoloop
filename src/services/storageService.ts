
import { Routine } from "../models/types";

const ROUTINES_KEY = 'choreoloop-routines';

export const saveRoutines = (routines: Routine[]): void => {
  localStorage.setItem(ROUTINES_KEY, JSON.stringify(routines));
};

export const getRoutines = (): Routine[] => {
  const savedRoutines = localStorage.getItem(ROUTINES_KEY);
  return savedRoutines ? JSON.parse(savedRoutines) : [];
};

export const saveRoutine = (routine: Routine): void => {
  const routines = getRoutines();
  const existingIndex = routines.findIndex(r => r.id === routine.id);
  
  if (existingIndex >= 0) {
    routines[existingIndex] = routine;
  } else {
    routines.push(routine);
  }
  
  saveRoutines(routines);
};

export const getRoutine = (id: string): Routine | undefined => {
  const routines = getRoutines();
  return routines.find(routine => routine.id === id);
};

export const deleteRoutine = (id: string): void => {
  const routines = getRoutines();
  const updatedRoutines = routines.filter(routine => routine.id !== id);
  saveRoutines(updatedRoutines);
};
