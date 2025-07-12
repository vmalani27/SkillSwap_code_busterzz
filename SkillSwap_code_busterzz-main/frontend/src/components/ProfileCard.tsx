
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileCardProps {
  id: string;
  name: string;
  profileImage: string;
  skillsOffered: string[];
  skillsWanted: string[];
  rating: number;
  location?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  id,
  name,
  profileImage,
  skillsOffered,
  skillsWanted,
  rating,
  location
}) => {
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={profileImage} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg text-foreground truncate">{name}</h3>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-muted-foreground">{rating}/5</span>
              </div>
            </div>
            
            {location && (
              <p className="text-sm text-muted-foreground mb-2">{location}</p>
            )}
            
            <div className="space-y-2 mb-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Skills Offered:</p>
                <div className="flex flex-wrap gap-1">
                  {skillsOffered.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Skills Wanted:</p>
                <div className="flex flex-wrap gap-1">
                  {skillsWanted.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Link to={`/profile/${id}`}>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </Link>
              <Link to={`/send-request/${id}`}>
                <Button size="sm">
                  Request
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
