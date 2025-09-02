import React, { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from '@nanostores/react';
import { faculties, selectedFaculty, setFaculty, initFaculty, loadingFaculties, fetchFaculties } from '@/stores/facultyStore';
import { Loader2 } from 'lucide-react';

const FacultySelector: React.FC = () => {
  const $selectedFaculty = useStore(selectedFaculty);
  const $faculties = useStore(faculties);
  const $loadingFaculties = useStore(loadingFaculties);

  useEffect(() => {
    // Inicializar las facultades y la selección al montar el componente
    const initialize = async () => {
      if ($faculties.length === 0) {
        await fetchFaculties();
      }
      await initFaculty();
    };
    
    initialize();
  }, []);

  const handleFacultyChange = (value: string) => {
    const faculty = $faculties.find(f => f.id.toString() === value);
    if (faculty) {
      setFaculty(faculty);
    }
  };

  if ($loadingFaculties) {
    return (
      <div className="flex items-center gap-2 h-10 px-3 py-2 border rounded-md">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Cargando...</span>
      </div>
    );
  }

  if (!$selectedFaculty || $faculties.length === 0) {
    return null;
  }

  return (
    <Select 
      value={$selectedFaculty.id.toString()} 
      onValueChange={handleFacultyChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Seleccionar facultad" />
      </SelectTrigger>
      <SelectContent>
        {$faculties.map((faculty) => (
          <SelectItem key={faculty.id} value={faculty.id.toString()}>
            {faculty.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FacultySelector;