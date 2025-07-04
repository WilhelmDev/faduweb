import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from 'lucide-react';
import type { Opinion } from '@/interfaces/Opinion';
import { FilterOpinions } from './OpinionFilters';
import type { Subject } from '@/interfaces/Subject';
import type { Career } from '@/interfaces/Career';
import { getSubjects } from '@/services/subject.service';
import { getAllCareers } from '@/services/career.service';
import { getOpinions } from '@/services/opinion.service';
import OpinionItem from './OpinionItem';
import OpinionDetailModal from './OpinionDetailModal';
import CreateOpinionModal from './CreateOpinionModal';
import { useStore } from '@nanostores/react';
import { isAuthenticated } from '@/stores/authStore'; // Asegúrate de que la ruta sea correcta

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

  const $isAuthenticated = useStore(isAuthenticated);

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

  const fetchOpinions = async (reload: boolean) => {
    try {
      setLoading(true);
      const newOpinions = await getOpinions(15, page * 15, filterCareer || 0, filterSubject || 0);
      if (newOpinions.length < 15) {
        setCanLoadMore(false);
      }
      setOpinions((prev) => reload ? newOpinions : [...prev, ...newOpinions]);
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
  }, [])

  useEffect(() => {
    fetchOpinions(false);
  }, [page])

  
  const handleFilterChange = (careerId: string | null, subjectId: string | null) => {
    setFilterCareer(careerId === "0"? null : parseInt(careerId || '0'));
    setFilterSubject(subjectId === "0"? null : parseInt(subjectId || '0'));
    setPage(0);
    setCanLoadMore(true);
    setOpinions([]);
    fetchOpinions(true);
  }

  const openModal = (opinion:Opinion) => {
    setSelectedOpinion(opinion);
    setShowDetailModal(true);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary">Opiniones de Estudiantes</h1>
        {$isAuthenticated && (
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" /> Crear Opinión
          </Button>
        )}
      </div>

      <FilterOpinions 
        subjects={subjects} 
        careers={careers} 
        onFilter={handleFilterChange}
      />
      
      {loading && opinions.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
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
            opinions.length > 0 && (
              <p className="text-center mt-8 text-muted-foreground">
                No hay más opiniones para cargar.
              </p>
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
        onClose={() => setShowCreateModal(false)} 
        onSubmit={() => {
          // Implementa la lógica para manejar la creación de una nueva opinión
          setShowCreateModal(false);
          fetchOpinions(true); // Recarga las opiniones después de crear una nueva
        }} 
        subjects={subjects}
      />
    </div>
  );
};