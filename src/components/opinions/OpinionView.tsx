import React, { useEffect, useMemo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from 'lucide-react';
import type { Opinion, OpinionPayload } from '@/interfaces/Opinion';
import { FilterOpinions } from './OpinionFilters';
import type { Subject } from '@/interfaces/Subject';
import type { Career } from '@/interfaces/Career';
import { getSubjects } from '@/services/subject.service';
import { getAllCareers } from '@/services/career.service';
import { createOpinion, getOpinions } from '@/services/opinion.service';
import OpinionItem from './OpinionItem';
import OpinionDetailModal from './OpinionDetailModal';
import CreateOpinionModal from './CreateOpinionModal';
import { useStore } from '@nanostores/react';
import { isAuthenticated } from '@/stores/authStore'; // Asegúrate de que la ruta sea correcta
import { toast } from 'sonner';
import { closeModals, isCreateOpinionModalOpen } from '@/stores/modalStore';
import CreateOpinionButton from '../shared/CreateOpinionButton';
import { selectedFaculty } from '@/stores/facultyStore';

interface OpinionViewProps {}

export const OpinionView: React.FC<OpinionViewProps> = () => {
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [filterCareer, setFilterCareer] = useState<number | null>(null);
  const [filterSubject, setFilterSubject] = useState<number | null>(null);
  const [selectedOpinion, setSelectedOpinion] = useState<Opinion | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [totalResults, setTotalResults] = useState<number>(0);

  const $isAuthenticated = useStore(isAuthenticated);
  const $isCreateOpinionModalOpen = useStore(isCreateOpinionModalOpen);
  const $selectedFaculty = useStore(selectedFaculty);

  const fetchData = async () => {
    try {
      const careers = await getAllCareers();
      const subjects = await getSubjects();
      setSubjects(subjects);
      setCareers(careers);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  }

  const fetchOpinions = async (reload: boolean, text?: string, career?: number | null, subject?: number | null) => {
    if (loading) return;
    try {
      setLoading(true);
      const faculty = selectedFaculty.get();
      const newOpinions = await getOpinions(
        10, 
        page * 10,
        text || '', 
        faculty? faculty.id : null,
        career === null ? 0 : career || 0, 
        subject === null ? 0 : subject || 0
      );
      if (newOpinions.data.length < 10) {
        setCanLoadMore(false);
      }
      setOpinions((prev) => reload ? newOpinions.data : [...prev, ...newOpinions.data]);
      setTotalResults(newOpinions.meta.total_elements);
    } catch (error) {
      console.error('Error fetching opinions', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  }

  useEffect(() => {
    fetchData();
  }, [$selectedFaculty])

  useEffect(() => {
    fetchOpinions(false);
  }, [page, $selectedFaculty])

  useEffect(() => {
    setShowCreateModal($isCreateOpinionModalOpen)
  }, [$isCreateOpinionModalOpen])

  const filtredSubjects = useMemo(() => {
    if (!filterCareer) return subjects;
    const filtred = subjects.filter((s) => s.subjectCategory.career_id === filterCareer);
    return filtred;
  }, [filterCareer])

  
  const handleFilterChange = async (careerId: string | null, subjectId: string | null, search: string) => {
    const newFilterCareer = careerId === "0" ? null : parseInt(careerId || '0');
    const newFilterSubject = subjectId === "0" ? null : parseInt(subjectId || '0');
    
    setFilterCareer(newFilterCareer);
    setFilterSubject(newFilterSubject);
    setSearchText(search);
    setPage(0);
    setCanLoadMore(true);
    setOpinions([]);
    
    // Usa los nuevos valores directamente en lugar de los estados
    fetchOpinions(true, search, newFilterCareer, newFilterSubject);
  }

  const openModal = (opinion:Opinion) => {
    setSelectedOpinion(opinion);
    setShowDetailModal(true);
  }

  const handleCreateOpinion = async (payload: OpinionPayload) => {
    try {
      await createOpinion(payload);
      setShowCreateModal(false);
      fetchOpinions(true);
      toast.success('Opinión creada exitosamente', {
        description: 'Tu opinion ha sido creada con éxito.',
        duration: 2000, // 3 segundos
        position: 'top-center',
      });
    } catch (error) {
      console.error('Error creating opinion', error);
      toast.error('Error al crear la opinión', {
        description: 'Ocurrió un error al crear tu opinion. Por favor, intente de nuevo más tarde.',
        duration: 3000, // 3 segundos
        position: 'top-center',
      });
    }

  }

  return (
    <div className="container mx-auto p-4">
      {/* <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary">Opiniones de Estudiantes</h1>
      </div> */}

      <FilterOpinions 
        subjects={filtredSubjects} 
        careers={careers} 
        onFilter={handleFilterChange}
      />
      
      {loading && opinions.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
        <p className="text-sm text-muted-foreground mt-4 mb-6 text-center">
          Total de resultados: {totalResults}
        </p>
          <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
            {opinions.map((opinion) => (
              <OpinionItem 
                key={opinion.id} 
                opinion={opinion} 
                onViewDetails={openModal}
              />
            ))}
          </div>
          
          {canLoadMore ? (
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={handleLoadMore} 
                disabled={loading}
                variant="secondary"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Cargando...
                  </>
                ) : (
                  'Cargar más'
                )}
              </Button>
            </div>
          ) : (
            opinions.length > 0 ? (
              <p className="text-center mt-8 text-muted-foreground">
                No hay más opiniones para cargar.
              </p>
            ) : (
              <div className='flex flex-col items-center gap-5'>
                <p className="text-center text-sm text-muted-foreground">
                  Aún no hay opiniones, ¡Sé el primero en dejar una!
                </p>
                <CreateOpinionButton />
              </div>
            )
          )}
        </>
      )}

      <OpinionDetailModal 
        isOpen={showDetailModal} 
        onClose={() => setShowDetailModal(false)} 
        opinion={selectedOpinion || {} as Opinion}
      />
      <CreateOpinionModal 
        isOpen={showCreateModal} 
        onClose={() => {
          closeModals()
        }} 
        onSubmit={handleCreateOpinion} 
      />
    </div>
  );
};