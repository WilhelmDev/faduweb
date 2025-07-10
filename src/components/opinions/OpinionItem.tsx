import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageCircle, Eye, User } from 'lucide-react';
import type { Opinion } from '@/interfaces/Opinion';

type Props = {
  opinion: Opinion
  onViewDetails: (opinion: Opinion) => void
}

export default function OpinionItem({ opinion, onViewDetails }: Props) {
  return (
    <div className="bg-card shadow-md rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={opinion.student?.image?.url ?? ''} alt={opinion.student.name} />
            <AvatarFallback>{opinion.student.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">{opinion.student.name}</h3>
            <p className="text-sm text-muted-foreground">{opinion.subject.name}</p>
          </div>
        </div>
        <h4 className="font-bold text-lg mb-2">{opinion.title}</h4>
        {opinion.professor && (
          <p className="text-sm text-muted-foreground mb-2 flex items-center">
            <User className="w-4 h-4 mr-1" />
            Cátedra: {opinion.professor}
          </p>
        )}
        <p className="text-muted-foreground  whitespace-pre-wrap">{opinion.description}</p>
        <div className="flex flex-wrap gap-2">
          {opinion.opinionTags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs">{tag.tag.name}</Badge>
          ))}
        </div>
      </div>
      <div className=" px-4 pb-3 flex justify-between items-center">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-1" />
            {opinion.answersCount}
          </span>
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(opinion.created_at).toLocaleDateString()}
          </span>
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => onViewDetails(opinion)}
          className="bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary-dark transition-colors cursor-pointer"
        >
          <Eye className="w-4 h-4 mr-1" />
          Ver más
        </Button>
      </div>
    </div>
  );
}