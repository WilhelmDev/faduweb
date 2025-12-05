import React, { useState, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { Career } from '@/interfaces/Career';
import type { Subject } from '@/interfaces/Subject';
import FacultySelector from '../shared/FacultySelector';

interface FilterOpinionsProps {
  careers: Career[];
  subjects: Subject[];
  onFilter: (careerId: string | null, subjectId: string | null, search: string) => void;
}

export const FilterOpinions: React.FC<FilterOpinionsProps> = ({ careers, subjects, onFilter }) => {
  const [selectedCareer, setSelectedCareer] = useState<string>("0");
  const [selectedSubject, setSelectedSubject] = useState<string>("0");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilter(
        selectedCareer === "0" ? null : selectedCareer,
        selectedSubject === "0" ? null : selectedSubject,
        searchTerm
      );
    }, 500);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [selectedCareer, selectedSubject, searchTerm]);

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-4 mb-6 w-full px-4">
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto md:flex-1 md:max-w-2xl">
        <FacultySelector />
        
        <Select
          onValueChange={(value) => setSelectedCareer(value)}
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
          onValueChange={(value) => setSelectedSubject(value)}
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
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};