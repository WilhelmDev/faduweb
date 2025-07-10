import React, { useState, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { Career } from '@/interfaces/Career';
import type { Subject } from '@/interfaces/Subject';

interface FilterOpinionsProps {
  careers: Career[];
  subjects: Subject[];
  onFilter: (careerId: string | null, subjectId: string | null, search: string) => void;
}

export const FilterOpinions: React.FC<FilterOpinionsProps> = ({ careers, subjects, onFilter }) => {
  const [selectedCareer, setSelectedCareer] = useState<string>("0");
  const [selectedSubject, setSelectedSubject] = useState<string>("0");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      onFilter(
        selectedCareer === "0" ? null : selectedCareer,
        selectedSubject === "0" ? null : selectedSubject,
        value
      );
    }, 600);
  };

  useEffect(() => {
    onFilter(
      selectedCareer === "0" ? null : selectedCareer,
      selectedSubject === "0" ? null : selectedSubject,
      searchTerm
    );
  }, [selectedCareer, selectedSubject]);

  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col-reverse items-center md:justify-center md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
      <div className="flex w-full md:w-2/6 sm:gap-4">
      <Select
        onValueChange={(value) => setSelectedCareer(value)}
        value={selectedCareer}
      >
        <SelectTrigger className="w-1/2">
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
        <SelectTrigger className="w-1/2">
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
        className="w-full not-sm:mb-2 md:w-1/6"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
};