import type { Opinion } from '@/interfaces/Opinion'
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '../ui/badge';
import { Calendar, Eye, MessageCircle } from 'lucide-react';
import { Button } from '../ui/button';

type Props = {
  opinion: Opinion
  onViewDetails: (opinion: Opinion) => void
}

export default function OpinionItem({ opinion, onViewDetails }: Props) {
  return (
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
          <Button variant="secondary" size="sm" onClick={() => onViewDetails(opinion)}>
            <Eye className="w-4 h-4 mr-1" />
            Ver
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}