
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MapPin, Clock } from 'lucide-react';

const ViewProfile = () => {
  const { userId } = useParams();

  // Mock data - in real app, fetch based on userId
  const profile = {
    id: userId,
    name: 'Marc Demo',
    location: 'San Francisco, CA',
    profileImage: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face',
    skillsOffered: ['JavaScript', 'Python', 'React'],
    skillsWanted: ['Illustrator', 'Graphic Design', 'Photography'],
    rating: 3.9,
    reviewCount: 47,
    availability: 'Weekends',
    bio: 'Experienced full-stack developer with 5+ years in web development. Passionate about clean code and user experience. Looking to expand my design skills while sharing my technical knowledge.',
    reviews: [
      {
        id: 1,
        reviewer: 'Sarah Chen',
        rating: 5,
        comment: 'Excellent JavaScript tutor! Marc explained complex concepts clearly and helped me build my first React app.',
        date: '2 weeks ago'
      },
      {
        id: 2,
        reviewer: 'David Johnson',
        rating: 4,
        comment: 'Great collaboration on our skill swap. Marc taught me Python basics while I helped with his design project.',
        date: '1 month ago'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={profile.profileImage} />
                  <AvatarFallback className="text-2xl">{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
                    <div className="flex items-center text-muted-foreground mt-1 space-x-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{profile.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{profile.availability}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(profile.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{profile.rating}/5</span>
                      <span className="text-muted-foreground">({profile.reviewCount} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link to={`/send-request/${profile.id}`}>
                      <Button>Send Swap Request</Button>
                    </Link>
                    <Button variant="outline">Message</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{profile.bio}</p>
            </CardContent>
          </Card>

          {/* Skills */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Skills I Can Offer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skillsOffered.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Skills I Want to Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skillsWanted.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews & Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{review.reviewer}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ViewProfile;
