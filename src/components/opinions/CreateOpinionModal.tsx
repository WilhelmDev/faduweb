import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X } from 'lucide-react';
import type { Subject } from '@/interfaces/Subject';
import { getCurrentUser } from '@/stores/authStore';
import { getSubjectsByCareer } from '@/services/subject.service';
import type { OpinionPayload } from '@/interfaces/Opinion';

interface CreateOpinionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (opinionData: OpinionPayload) => void;
}

const CreateOpinionModal: React.FC<CreateOpinionModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [subjectId, setSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('');
  const [professor, setProfessor] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [professrs, setProfessors] = useState<string[]>([]);

  const fetchSubjects = async () => {
    const user = getCurrentUser();
    if (!user) return;
    try {
      const data = await getSubjectsByCareer(user.career_id);
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      subject_id: parseInt(subjectId),
      title,
      description,
      currentSchoolYear: year,
      professor,
      anonymous: isAnonymous ? 1 : 0,
      tags: [],
    });
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      fetchSubjects();
    }
  }, [isOpen])

  useEffect(() => {
    if (subjectId) {
      const subject = subjects.find((s) => s.id === parseInt(subjectId)) as Subject;
      setProfessors(subject.chairs)
    }
  }, [subjectId])

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 py-6 sm:p-0">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-background/80 backdrop-blur-md p-6 sm:p-8 rounded-lg shadow-lg relative w-full max-w-2xl mx-auto overflow-y-auto max-h-[90vh]">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <h2 className="text-2xl font-semibold mb-6 text-primary">Crear Nueva Opinión</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="subject" className="block text-sm font-medium text-muted-foreground">Materia</label>
              <Select onValueChange={setSubjectId} value={subjectId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una materia" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="year" className="block text-sm font-medium text-muted-foreground">Año de Cursada</label>
              <Input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} required className="w-full" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-muted-foreground">Título</label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-muted-foreground">Descripción</label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              className="w-full min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="professor" className="block text-sm font-medium text-muted-foreground">Cátedra (Profesor)</label>
            <Select onValueChange={setProfessor} value={professor}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una cátedra" />
              </SelectTrigger>
              <SelectContent>
                {professrs.map((prof, index) => (
                  <SelectItem key={index} value={prof}>
                    {prof}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
            <label htmlFor="anonymous" className="text-sm font-medium text-muted-foreground">Publicar de forma anónima</label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Crear Opinión</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOpinionModal;