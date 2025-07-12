import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { Users, ArrowRight, CheckCircle } from 'lucide-react';

const ProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<Array<{ id: number; name: string }>>([]);
  const [selectedSkills, setSelectedSkills] = useState<Array<{ id: number; name: string; is_offered: boolean }>>([]);
  
  const [formData, setFormData] = useState({
    location: '',
    availability: '',
    bio: '',
    is_public: true
  });

  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load available skills
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const skillsData = await api.getSkills();
        setSkills(skillsData);
      } catch (error) {
        console.error('Failed to load skills:', error);
        toast({
          title: "Error",
          description: "Failed to load skills. Please refresh the page.",
          variant: "destructive",
        });
      }
    };

    loadSkills();
  }, [toast]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSkillToggle = (skill: { id: number; name: string }) => {
    setSelectedSkills(prev => {
      const exists = prev.find(s => s.id === skill.id);
      if (exists) {
        return prev.filter(s => s.id !== skill.id);
      } else {
        return [...prev, { ...skill, is_offered: true }];
      }
    });
  };

  const handleSkillTypeChange = (skillId: number, isOffered: boolean) => {
    setSelectedSkills(prev => 
      prev.map(skill => 
        skill.id === skillId ? { ...skill, is_offered: isOffered } : skill
      )
    );
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.location || !formData.availability) {
        toast({
          title: "Required Fields",
          description: "Please fill in your location and availability.",
          variant: "destructive",
        });
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleComplete = async () => {
    if (selectedSkills.length === 0) {
      toast({
        title: "Skills Required",
        description: "Please select at least one skill.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Update user profile
      await updateUser(formData);

      // Add user skills
      for (const skill of selectedSkills) {
        await api.createUserSkill({
          skill_id: skill.id,
          is_offered: skill.is_offered
        });
      }

      toast({
        title: "Profile Complete!",
        description: "Your profile has been set up successfully.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Profile setup error:', error);
      toast({
        title: "Setup Failed",
        description: error instanceof Error ? error.message : "Failed to complete profile setup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                Skill Swap Platform
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Welcome, {user.first_name}!
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'bg-primary text-primary-foreground border-primary' : 'border-muted-foreground'}`}>
                {currentStep > 1 ? <CheckCircle className="h-4 w-4" /> : '1'}
              </div>
              <span className="text-sm font-medium">Basic Info</span>
            </div>
            
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'bg-primary text-primary-foreground border-primary' : 'border-muted-foreground'}`}>
                {currentStep > 2 ? <CheckCircle className="h-4 w-4" /> : '2'}
              </div>
              <span className="text-sm font-medium">Skills</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {currentStep === 1 ? 'Tell us about yourself' : 'What skills do you have?'}
            </CardTitle>
            <p className="text-center text-muted-foreground">
              {currentStep === 1 
                ? 'Help others find you by sharing your location and availability'
                : 'Select the skills you can offer and want to learn'
              }
            </p>
          </CardHeader>
          
          <CardContent>
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-base font-medium">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Enter your city"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="h-12 text-base"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availability" className="text-base font-medium">Availability</Label>
                  <Select 
                    value={formData.availability} 
                    onValueChange={(value) => setFormData({...formData, availability: value})}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select your availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekdays">Weekdays</SelectItem>
                      <SelectItem value="weekends">Weekends</SelectItem>
                      <SelectItem value="evenings">Evenings</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-base font-medium">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell others about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="min-h-[100px] text-base"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_public"
                    checked={formData.is_public}
                    onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="is_public" className="text-sm">
                    Make my profile public so others can find me
                  </Label>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">Select your skills</Label>
                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {skills.map((skill) => {
                      const isSelected = selectedSkills.find(s => s.id === skill.id);
                      return (
                        <div key={skill.id} className="space-y-2">
                          <button
                            type="button"
                            onClick={() => handleSkillToggle(skill)}
                            className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                              isSelected 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="font-medium">{skill.name}</div>
                          </button>
                          
                          {isSelected && (
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => handleSkillTypeChange(skill.id, true)}
                                className={`flex-1 py-2 px-3 text-xs rounded border ${
                                  isSelected.is_offered 
                                    ? 'bg-primary text-primary-foreground border-primary' 
                                    : 'bg-background border-border'
                                }`}
                              >
                                I can teach
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSkillTypeChange(skill.id, false)}
                                className={`flex-1 py-2 px-3 text-xs rounded border ${
                                  !isSelected.is_offered 
                                    ? 'bg-primary text-primary-foreground border-primary' 
                                    : 'bg-background border-border'
                                }`}
                              >
                                I want to learn
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {selectedSkills.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Selected Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map((skill) => (
                        <div
                          key={skill.id}
                          className={`px-3 py-1 rounded-full text-sm ${
                            skill.is_offered 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {skill.name} ({skill.is_offered ? 'Teaching' : 'Learning'})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              
              {currentStep === 1 ? (
                <Button onClick={handleNext} className="bg-primary">
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete} 
                  className="bg-primary"
                  disabled={isLoading || selectedSkills.length === 0}
                >
                  {isLoading ? "Completing..." : "Complete Setup"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfileSetup; 