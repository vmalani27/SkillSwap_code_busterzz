
import { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Check, X, Clock, ArrowRight } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface SwapRequest {
  id: string;
  from: {
    name: string;
    profileImage: string;
    rating: number;
  };
  skillOffered: string;
  skillWanted: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  date: string;
  type: 'received' | 'sent';
}

const SwapRequests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data
  const swapRequests: SwapRequest[] = [
    {
      id: '1',
      from: {
        name: 'Marc Demo',
        profileImage: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face',
        rating: 3.9
      },
      skillOffered: 'JavaScript',
      skillWanted: 'Graphic Design',
      status: 'pending',
      message: 'Hi! I\'d love to help you learn JavaScript in exchange for some graphic design skills. I have 5+ years of experience...',
      date: '2 hours ago',
      type: 'received'
    },
    {
      id: '2',
      from: {
        name: 'Sarah Chen',
        profileImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face',
        rating: 4.7
      },
      skillOffered: 'UI/UX Design',
      skillWanted: 'React',
      status: 'accepted',
      message: 'Great! I\'m excited to start our skill exchange. When would be a good time to begin?',
      date: '1 day ago',
      type: 'received'
    },
    {
      id: '3',
      from: {
        name: 'David Johnson',
        profileImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop&crop=face',
        rating: 4.2
      },
      skillOffered: 'Python',
      skillWanted: 'Photography',
      status: 'pending',
      message: 'I saw your photography work and would love to learn from you. I can teach you Python in return.',
      date: '3 days ago',
      type: 'sent'
    },
    {
      id: '4',
      from: {
        name: 'Emma Wilson',
        profileImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100&h=100&fit=crop&crop=face',
        rating: 4.5
      },
      skillOffered: 'Content Writing',
      skillWanted: 'Web Development',
      status: 'rejected',
      message: 'Thanks for your interest, but I\'m currently focusing on other projects.',
      date: '1 week ago',
      type: 'received'
    }
  ];

  const itemsPerPage = 3;
  const totalPages = Math.ceil(swapRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = swapRequests.slice(startIndex, endIndex);

  const handleAccept = (requestId: string) => {
    console.log('Accepting request:', requestId);
  };

  const handleReject = (requestId: string) => {
    console.log('Rejecting request:', requestId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
        return <Check className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Filter Section */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search swap requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Swap Requests List */}
        <div className="space-y-4">
          {currentRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                  {/* Profile Info */}
                  <div className="flex items-center space-x-4 lg:flex-shrink-0">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={request.from.profileImage} />
                      <AvatarFallback>{request.from.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{request.from.name}</h3>
                      <p className="text-sm text-muted-foreground">★ {request.from.rating}/5</p>
                      <p className="text-xs text-muted-foreground">{request.date}</p>
                    </div>
                  </div>

                  {/* Skill Exchange Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3">
                      <Badge variant="secondary" className="text-center">
                        Offers: {request.skillOffered}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto sm:mx-0" />
                      <Badge variant="outline" className="text-center">
                        Wants: {request.skillWanted}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {request.message}
                    </p>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col items-center space-y-3 lg:flex-shrink-0">
                    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="capitalize">{request.status}</span>
                    </div>
                    
                    {request.status === 'pending' && request.type === 'received' && (
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleAccept(request.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleReject(request.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                    
                    {request.type === 'sent' && (
                      <Badge variant="outline" className="text-xs">
                        Sent Request
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
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

export default SwapRequests;
