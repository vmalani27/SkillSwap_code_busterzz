
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight } from 'lucide-react';

const SendSwapRequest = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const [mySkill, setMySkill] = useState('');
  const [theirSkill, setTheirSkill] = useState('');
  const [message, setMessage] = useState('');

  // Mock data - in real app, fetch based on userId and current user
  const recipient = {
    name: 'Marc Demo',
    profileImage: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face',
    skillsWanted: ['Illustrator', 'Graphic Design', 'Photography']
  };

  const mySkills = ['JavaScript', 'React', 'UI/UX Design', 'Python', 'Node.js'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending swap request:', {
      recipientId: userId,
      mySkill,
      theirSkill,
      message
    });
    navigate('/swap-requests');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={recipient.profileImage} />
                  <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Send Swap Request to {recipient.name}</CardTitle>
                  <p className="text-muted-foreground">Propose a skill exchange</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Skill Exchange Visual */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground mb-2">I'll teach</p>
                      <div className="bg-green-100 dark:bg-green-900/20 px-3 py-2 rounded-md min-h-[40px] flex items-center justify-center">
                        <span className="text-green-700 dark:text-green-300 font-medium">
                          {mySkill || 'Select your skill'}
                        </span>
                      </div>
                    </div>
                    
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground mb-2">I want to learn</p>
                      <div className="bg-blue-100 dark:bg-blue-900/20 px-3 py-2 rounded-md min-h-[40px] flex items-center justify-center">
                        <span className="text-blue-700 dark:text-blue-300 font-medium">
                          {theirSkill || 'Select their skill'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* My Skill Selection */}
                <div className="space-y-2">
                  <Label htmlFor="mySkill">Choose a skill you can offer</Label>
                  <Select value={mySkill} onValueChange={setMySkill} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select one of your skills" />
                    </SelectTrigger>
                    <SelectContent>
                      {mySkills.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Their Skill Selection */}
                <div className="space-y-2">
                  <Label htmlFor="theirSkill">Choose a skill you want to learn from them</Label>
                  <Select value={theirSkill} onValueChange={setTheirSkill} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select their skill you're interested in" />
                    </SelectTrigger>
                    <SelectContent>
                      {recipient.skillsWanted.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Personal Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Introduce yourself and explain why you'd be a great match for this skill swap..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <Button type="submit" className="flex-1">
                    Send Request
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(-1)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SendSwapRequest;
