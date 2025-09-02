import { useEffect } from 'react';
import { fetchFaculties, initFaculty } from '@/stores/facultyStore';

const FacultyInitializer = () => {
  useEffect(() => {
    const initialize = async () => {
      await fetchFaculties();
      await initFaculty();
    };
    
    initialize();
  }, []);
  
  return null; // Este componente no renderiza nada
};

export default FacultyInitializer;