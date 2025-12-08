import React, { useState, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { Career } from '@/interfaces/Career';
import type { Subject } from '@/interfaces/Subject';
import FacultySelector from '../shared/FacultySelector';
import { trackOpinionSearch, trackFilterChange } from '@/lib/analytics';
import { selectedFaculty } from '@/stores/facultyStore';
import { useStore } from '@nanostores/react';

interface FilterOpinionsProps {
  careers: Career[];
  subjects: Subject[];
  onFilter: (careerId: string | null, subjectId: string | null, search: string) => void;
}

export const FilterOpinions: React.FC<FilterOpinionsProps> = ({ careers, subjects, onFilter }) => {
  const [selectedCareer, setSelectedCareer] = useState<string>("0");
  const [selectedSubject, setSelectedSubject] = useState<string>("0");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const $selectedFaculty = useStore(selectedFaculty);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilter(
        selectedCareer === "0" ? null : selectedCareer,
        selectedSubject === "0" ? null : selectedSubject,
        searchTerm
      );

      // Track search event in Google Analytics
      const selectedCareerData = careers.find(c => c.id.toString() === selectedCareer);
      const selectedSubjectData = subjects.find(s => s.id.toString() === selectedSubject);

      trackOpinionSearch({
        search_term: searchTerm,
        career_id: selectedCareer === "0" ? null : selectedCareer,
        career_name: selectedCareerData?.name,
        subject_id: selectedSubject === "0" ? null : selectedSubject,
        subject_name: selectedSubjectData?.name,
        faculty_id: $selectedFaculty?.id || null,
        faculty_name: $selectedFaculty?.title,
      });
    }, 500);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [selectedCareer, selectedSubject, searchTerm, careers, subjects, $selectedFaculty]);

  const handleCareerChange = (value: string) => {
    setSelectedCareer(value);
    const careerName = careers.find(c => c.id.toString() === value)?.name || 'Todas las Carreras';
    trackFilterChange('career', value, careerName);
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    const subjectName = subjects.find(s => s.id.toString() === value)?.name || 'Todas las Materias';
    trackFilterChange('subject', value, subjectName);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-4 mb-6 w-full px-4">
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto md:flex-1 md:max-w-2xl">
        <FacultySelector />
        
        <Select
          onValueChange={handleCareerChange}
          value={selectedCareer}
        >
          <SelectTrigger className="w-full sm:flex-1">
            <SelectValue placeholder="Seleccionar Carrera" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Todas las Carreras</SelectItem>
            {careers.map((career) => (
              <SelectItem key={career.id} value={career.id.toString()}>
                {career.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={handleSubjectChange}
          value={selectedSubject}
        >
          <SelectTrigger className="w-full sm:flex-1">
            <SelectValue placeholder="Seleccionar Materia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Todas las Materias</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id.toString()}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Input
        type="text"
        placeholder="Buscar..."
        className="w-full md:w-64"
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};