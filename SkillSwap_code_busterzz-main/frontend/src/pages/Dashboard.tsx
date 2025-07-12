
import { useState } from 'react';
import { Search, Filter, MapPin, Star, ChevronDown, X } from 'lucide-react';
import Header from '@/components/Header';
import ProfileCard from '@/components/ProfileCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [availability, setAvailability] = useState('');
  const [location, setLocation] = useState('');
  const [skillCategory, setSkillCategory] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [ratingRange, setRatingRange] = useState([3.0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const indianCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 
    'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur'
  ];

  const skillCategories = ['Tech', 'Art', 'Language', 'Business', 'Health', 'Music'];

  // Mock data with Indian names and locations
  const profiles = [
    {
      id: '1',
      name: 'Rohan Sharma',
      profileImage: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face',
      skillsOffered: ['JavaScript', 'Python'],
      skillsWanted: ['Illustrator', 'Graphic Design'],
      rating: 4.2,
      location: 'Mumbai, Maharashtra'
    },
    {
      id: '2',
      name: 'Priya Chen',
      profileImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face',
      skillsOffered: ['UI/UX Design', 'Figma'],
      skillsWanted: ['React', 'TypeScript'],
      rating: 4.8,
      location: 'Bangalore, Karnataka'
    },
    {
      id: '3',
      name: 'Arjun Patel',
      profileImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop&crop=face',
      skillsOffered: ['Photography', 'Video Editing'],
      skillsWanted: ['Web Development', 'SEO'],
      rating: 4.5,
      location: 'Delhi, Delhi'
    },
    {
      id: '4',
      name: 'Sneha Gupta',
      profileImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100&h=100&fit=crop&crop=face',
      skillsOffered: ['Content Writing', 'Copywriting'],
      skillsWanted: ['Social Media Marketing', 'Branding'],
      rating: 4.6,
      location: 'Pune, Maharashtra'
    },
    {
      id: '5',
      name: 'Vikram Singh',
      profileImage: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop&crop=face',
      skillsOffered: ['Digital Marketing', 'Analytics'],
      skillsWanted: ['Machine Learning', 'Data Science'],
      rating: 4.3,
      location: 'Hyderabad, Telangana'
    },
    {
      id: '6',
      name: 'Kavya Reddy',
      profileImage: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face',
      skillsOffered: ['Graphic Design', 'Branding'],
      skillsWanted: ['Flutter', 'Mobile Development'],
      rating: 4.9,
      location: 'Chennai, Tamil Nadu'
    }
  ];

  const itemsPerPage = 4;
  const totalPages = Math.ceil(profiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProfiles = profiles.slice(startIndex, endIndex);

  const clearAllFilters = () => {
    setSearchQuery('');
    setAvailability('');
    setLocation('');
    setSkillCategory('');
    setSkillLevel('');
    setSortBy('relevance');
    setRatingRange([3.0]);
  };

  const hasActiveFilters = searchQuery || availability || location || skillCategory || skillLevel || sortBy !== 'relevance' || ratingRange[0] > 3.0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Search and Quick Filters */}
        <Card className="mb-6 shadow-lg border-2 border-teal-100 dark:border-teal-900">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Search skills, names, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-base font-medium"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-[160px] h-12">
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {indianCities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="h-12 font-medium">
                      <Filter className="h-4 w-4 mr-2" />
                      Advanced Filters
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="mt-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Availability</label>
                            <Select value={availability} onValueChange={setAvailability}>
                              <SelectTrigger>
                                <SelectValue placeholder="Any" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="weekdays">Weekdays</SelectItem>
                                <SelectItem value="weekends">Weekends</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Skill Category</label>
                            <Select value={skillCategory} onValueChange={setSkillCategory}>
                              <SelectTrigger>
                                <SelectValue placeholder="Any" />
                              </SelectTrigger>
                              <SelectContent>
                                {skillCategories.map((category) => (
                                  <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Skill Level</label>
                            <Select value={skillLevel} onValueChange={setSkillLevel}>
                              <SelectTrigger>
                                <SelectValue placeholder="Any" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="expert">Expert</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Sort By</label>
                            <Select value={sortBy} onValueChange={setSortBy}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="relevance">Relevance</SelectItem>
                                <SelectItem value="rating">Rating</SelectItem>
                                <SelectItem value="newest">Newest</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <label className="text-sm font-medium flex items-center">
                            <Star className="h-4 w-4 mr-1 fill-amber-400 text-amber-400" />
                            Minimum Rating: {ratingRange[0].toFixed(1)}
                          </label>
                          <Slider
                            value={ratingRange}
                            onValueChange={setRatingRange}
                            max={5}
                            min={1}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="mt-4 flex justify-between">
                          <Button onClick={clearAllFilters} variant="outline" disabled={!hasActiveFilters}>
                            <X className="h-4 w-4 mr-2" />
                            Clear All
                          </Button>
                          <Badge variant="secondary" className="px-3 py-1">
                            {profiles.length} profiles found
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          {currentProfiles.map((profile) => (
            <ProfileCard key={profile.id} {...profile} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index + 1}>
                    <PaginationLink
                      onClick={() => setCurrentPage(index + 1)}
                      isActive={currentPage === index + 1}
                      className="cursor-pointer"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
