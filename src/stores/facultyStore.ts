import type { Faculty } from '@/interfaces/Faculty';
import { getAllFaculties } from '@/services/faculty.service';
import { atom } from 'nanostores';

// Lista de facultades disponibles (inicialmente vacía)
export const faculties = atom<Faculty[]>([]);

// Store para la facultad seleccionada (inicialmente null)
export const selectedFaculty = atom<Faculty | null>(null);

// Store para el estado de carga
export const loadingFaculties = atom<boolean>(false);

// Función para obtener las facultades desde la API
export async function fetchFaculties() {
  try {
    loadingFaculties.set(true);
    const response = await getAllFaculties();
    faculties.set(response);
    
    // Si hay facultades y no hay una seleccionada, seleccionar la primera
    if (response.length > 0 && !selectedFaculty.get()) {
      const storedFacultyId = localStorage.getItem('selectedFacultyId');
      
      if (storedFacultyId) {
        const found = response.find(f => f.id.toString() === storedFacultyId);
        if (found) {
          selectedFaculty.set(found);
        } else {
          selectedFaculty.set(response[0]);
        }
      } else {
        selectedFaculty.set(response[0]);
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching faculties:', error);
    return [];
  } finally {
    loadingFaculties.set(false);
  }
}

// Función para cambiar la facultad seleccionada
export function setFaculty(faculty: Faculty) {
  selectedFaculty.set(faculty);
  // Guardar en localStorage para persistencia
  localStorage.setItem('selectedFacultyId', faculty.id.toString());
  loadingFaculties.set(true);
  setTimeout(() => {
    loadingFaculties.set(false);
  }, 500);
}

// Función para inicializar la facultad desde localStorage
export async function initFaculty() {
  // Primero obtenemos las facultades si aún no están cargadas
  if (faculties.get().length === 0) {
    await fetchFaculties();
  }
  
  const storedFacultyId = localStorage.getItem('selectedFacultyId');
  const currentFaculties = faculties.get();
  
  if (storedFacultyId && currentFaculties.length > 0) {
    const found = currentFaculties.find(f => f.id.toString() === storedFacultyId);
    if (found) {
      selectedFaculty.set(found);
    } else {
      // Si no se encuentra la facultad guardada, usar la primera
      selectedFaculty.set(currentFaculties[0]);
    }
  } else if (currentFaculties.length > 0 && !selectedFaculty.get()) {
    // Si no hay facultad guardada pero hay facultades disponibles
    selectedFaculty.set(currentFaculties[0]);
  }
}