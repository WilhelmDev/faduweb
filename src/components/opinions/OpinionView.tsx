import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUp, Calendar, Trash2, Eye, Loader2 } from 'lucide-react';
import type { Opinion } from '@/interfaces/Opinion';
import { FilterOpinions } from './OpinionFilters';
import type { Subject } from '@/interfaces/Subject';
import type { Career } from '@/interfaces/Career';
import { getSubjects } from '@/services/subject.service';
import { getAllCareers } from '@/services/career.service';
import { getOpinions } from '@/services/opinion.service';

interface OpinionViewProps {
}

export const OpinionView: React.FC<OpinionViewProps> = () => {
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [filterCareer, setFilterCareer] = useState<number | null>(null);
  const [filterSubject, setFilterSubject] = useState<number | null>(null);

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-primary mb-6">Opiniones de Estudiantes</h1>
      <FilterOpinions subjects={subjects} careers={careers} onFilter={handleFilterChange}/>
      
      {loading && opinions.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {opinions.map((opinion) => (
              <Card key={opinion.id} className="w-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={opinion.student?.image?.url ?? ''} alt={opinion.student.name} />
                      <AvatarFallback>{opinion.student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-foreground truncate">{opinion.title}</h2>
                      <p className="text-sm text-muted-foreground truncate">
                        {opinion.student.name} - {opinion.subject.name}
                      </p>
                      <p className="mt-1 text-sm text-foreground line-clamp-2">{opinion.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {opinion.opinionTags.slice(0, 3).map((tag) => (
                      <Badge key={tag.id} variant="secondary" className="text-xs">{tag.tag.name}</Badge>
                    ))}
                    {opinion.opinionTags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">...</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {opinion.answersCount}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(opinion.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {canLoadMore ? (
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={handleLoadMore} 
                disabled={loading}
                className="flex items-center space-x-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{loading ? 'Cargando...' : 'Cargar más'}</span>
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
    </div>
  );
};