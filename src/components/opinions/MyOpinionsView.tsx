import type { Opinion, OpinionPayload } from '@/interfaces/Opinion'
import type { User } from '@/interfaces/User'
import { createOpinion, getOpinionsByStudent } from '@/services/opinion.service'
import { getCurrentUser } from '@/stores/authStore'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import OpinionItem from './OpinionItem'
import OpinionDetailModal from './OpinionDetailModal'
import CreateOpinionButton from '../shared/CreateOpinionButton'
import { toast } from 'sonner'
import { closeModals, isCreateOpinionModalOpen } from '@/stores/modalStore'
import CreateOpinionModal from './CreateOpinionModal'
import { useStore } from '@nanostores/react'

export default function MyOpinionsView() {
  const [opinions, setOpinions] = useState<Opinion[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedOpinion, setSelectedOpinion] = useState<Opinion | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const $isCreateOpinionModalOpen = useStore(isCreateOpinionModalOpen);

  const fetchOpinions = async () => {
    if (loading) return;
    try {
      setLoading(true)
      const user = getCurrentUser() as User
      const data = await getOpinionsByStudent(user.id)
      setOpinions(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOpinions()
  }, [])

  useEffect(() => {
    setShowCreateModal($isCreateOpinionModalOpen)
  }, [$isCreateOpinionModalOpen])

  const openModal = (opinion: Opinion) => {
    setShowModal(true)
    setSelectedOpinion(opinion)
  }

  const handleCreateOpinion = async (payload: OpinionPayload) => {
    try {
      await createOpinion(payload);
      setShowCreateModal(false);
      fetchOpinions();
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
      {loading && opinions.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
            {opinions.map((opinion) => (
              <OpinionItem
                key={opinion.id} 
                opinion={opinion} 
                onViewDetails={openModal}
              />
            ))}
          </div>
          
          {
            opinions.length > 0 && (
              <p className="text-center mt-8 text-muted-foreground">
                No hay más opiniones para cargar.
              </p>
            )
          }
        </>
      )}
      {
        (opinions.length === 0 && !loading) && (
          <div className='flex flex-col items-center gap-5'>
            <p className="text-center text-sm text-muted-foreground">
              Aún no has realizado ninguna opinión. Puedes comenzar a escribir una aquí.
            </p>
            <CreateOpinionButton />
          </div>
        )
      }
      <OpinionDetailModal
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
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
  )
}
