import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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

// Definir el esquema de validación
const opinionSchema = z.object({
  subject_id: z.string().min(1, "Debes seleccionar una materia"),
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres"),
  currentSchoolYear: z.string()
    .refine(val => {
      const year = parseInt(val);
      return year >= 1900 && year <= new Date().getFullYear();
    }, "Ingresa un año válido"),
  professor: z.string().min(1, "Debes seleccionar una cátedra"),
  anonymous: z.boolean(),
});

type FormData = z.infer<typeof opinionSchema>;

interface CreateOpinionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (opinionData: OpinionPayload) => void;
}

const CreateOpinionModal: React.FC<CreateOpinionModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [professors, setProfessors] = useState<string[]>([]);

  const { control, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(opinionSchema),
    defaultValues: {
      subject_id: '',
      title: '',
      description: '',
      currentSchoolYear: '',
      professor: '',
      anonymous: false,
    },
  });

  const selectedSubjectId = watch('subject_id');

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

  useEffect(() => {
    if (isOpen) {
      fetchSubjects();
      reset();
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (selectedSubjectId) {
      const subject = subjects.find((s) => s.id === parseInt(selectedSubjectId));
      setProfessors(subject?.chairs || []);
    }
  }, [selectedSubjectId, subjects]);

  const onSubmitForm = (data: FormData) => {
    onSubmit({
      ...data,
      subject_id: parseInt(data.subject_id),
      anonymous: data.anonymous ? 1 : 0,
      tags: [],
    });
    onClose();
  };

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
        
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="subject_id" className="block text-sm font-medium text-muted-foreground">Materia</label>
              <Controller
                name="subject_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
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
                )}
              />
              {errors.subject_id && <p className="text-sm text-red-500">{errors.subject_id.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="currentSchoolYear" className="block text-sm font-medium text-muted-foreground">Año de Cursada</label>
              <Controller
                name="currentSchoolYear"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="number" className="w-full" />
                )}
              />
              {errors.currentSchoolYear && <p className="text-sm text-red-500">{errors.currentSchoolYear.message}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-muted-foreground">Título</label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input {...field} className="w-full" />
              )}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-muted-foreground">Descripción</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea {...field} className="w-full min-h-[100px]" />
              )}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="professor" className="block text-sm font-medium text-muted-foreground">Cátedra (Profesor)</label>
            <Controller
              name="professor"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una cátedra" />
                  </SelectTrigger>
                  <SelectContent>
                    {professors.map((prof, index) => (
                      <SelectItem key={index} value={prof}>
                        {prof}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.professor && <p className="text-sm text-red-500">{errors.professor.message}</p>}
          </div>
          
          <div className="flex items-center space-x-2">
            <Controller
              name="anonymous"
              control={control}
              render={({ field }) => (
                <Switch
                  id="anonymous"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
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