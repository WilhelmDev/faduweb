import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import type { Opinion } from '@/interfaces/Opinion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '../ui/badge';
import { Calendar, MessageCircle } from 'lucide-react';

interface OpinionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  opinion: Opinion;
}

const OpinionDetailModal: React.FC<OpinionDetailModalProps> = ({ isOpen, onClose, opinion }) => {
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
        
        <div className="flex items-start space-x-4 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={opinion.student?.image?.url ?? ''} alt={opinion.student.name} />
            <AvatarFallback>{opinion.student.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold text-foreground">{opinion.title}</h2>
            <p className="text-sm text-muted-foreground">
              {opinion.student.name} - {opinion.subject.name}
            </p>
          </div>
        </div>

        <p className="text-foreground mb-4">{opinion.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {opinion.opinionTags.map((tag) => (
            <Badge key={tag.id} variant="secondary">{tag.tag.name}</Badge>
          ))}
        </div>

        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-1" />
            {opinion.answersCount} respuestas
          </span>
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(opinion.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Aquí puedes agregar más detalles o respuestas si es necesario */}
      </div>
    </div>
  );
};

export default OpinionDetailModal;