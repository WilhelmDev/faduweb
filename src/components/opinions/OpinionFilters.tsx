import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from 'lucide-react';
import type { Career } from '@/interfaces/Career';
import type { Subject } from '@/interfaces/Subject';

interface FilterOpinionsProps {
  careers: Career[];
  subjects: Subject[];
  onFilter: (careerId: string | null, subjectId: string | null) => void;
}

export const FilterOpinions: React.FC<FilterOpinionsProps> = ({ careers, subjects, onFilter }) => {
  const [selectedCareer, setSelectedCareer] = useState<string>("0");
  const [selectedSubject, setSelectedSubject] = useState<string>("0");

  const handleFilter = () => {
    onFilter(
      selectedCareer === "0" ? null : selectedCareer,
      selectedSubject === "0" ? null : selectedSubject
    );
  };

  return (
    <Card className="mb-6 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Filter className="mr-2 h-5 w-5" />
          Filtrar Opiniones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label htmlFor="career-select" className="text-sm font-medium text-muted-foreground">
              Carrera
            </label>
            <Select
              onValueChange={(value) => setSelectedCareer(value)}
              value={selectedCareer}
            >
              <SelectTrigger id="career-select" className="w-full">
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
          </div>
          <div className="space-y-2">
            <label htmlFor="subject-select" className="text-sm font-medium text-muted-foreground">
              Materia
            </label>
            <Select
              onValueChange={(value) => setSelectedSubject(value)}
              value={selectedSubject}
            >
              <SelectTrigger id="subject-select" className="w-full">
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
        </div>
        <Button onClick={handleFilter} className="w-full">
          Aplicar Filtros
        </Button>
      </CardContent>
    </Card>
  );
};