import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUp, Calendar, Trash2, Eye } from 'lucide-react';
import type { Opinion } from '@/interfaces/Opinion';

interface OpinionViewProps {
  opinions: Opinion[];
}

export const OpinionView: React.FC<OpinionViewProps> = ({ opinions }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-primary mb-6">Opiniones de Estudiantes</h1>
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
    </div>
  );
};