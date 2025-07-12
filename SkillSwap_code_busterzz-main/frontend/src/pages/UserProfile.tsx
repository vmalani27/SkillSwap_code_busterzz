
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, Camera } from 'lucide-react';
import { api } from '@/services/api';

const UserProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);
  const [skillsOffered, setSkillsOffered] = useState<any[]>([]);
  const [skillsWanted, setSkillsWanted] = useState<any[]>([]);
  const [newOfferedSkill, setNewOfferedSkill] = useState('');
  const [newWantedSkill, setNewWantedSkill] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch user profile and skills on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const user = await api.getCurrentUser();
      setFormData({
        name: `${user.first_name} ${user.last_name}`,
        location: user.location || '',
        availability: user.availability || '',
        profileStatus: user.is_public ? 'Public' : 'Private',
        bio: user.bio || '',
        profileImage: user.profile_photo || '',
      });
    };
    const fetchSkills = async () => {
      const userSkills = await api.getUserSkillList();
      setSkillsOffered(userSkills.filter((s: any) => s.is_offered).map((s: any) => ({ id: s.id, name: s.skill.name })));
      setSkillsWanted(userSkills.filter((s: any) => !s.is_offered).map((s: any) => ({ id: s.id, name: s.skill.name })));
    };
    Promise.all([fetchProfile(), fetchSkills()]).then(() => setLoading(false));
  }, []);

  // Save profile changes
  const handleSave = async () => {
    if (!formData) return;
    // Split name into first/last
    const [first_name, ...rest] = formData.name.split(' ');
    const last_name = rest.join(' ');
    await api.updateProfile({
      first_name,
      last_name,
      location: formData.location,
      availability: formData.availability,
      is_public: formData.profileStatus === 'Public',
      bio: formData.bio,
      // profile_photo: ... (handle upload separately)
    });
    navigate('/');
  };

  // Add/remove skills (backend)
  const addSkill = async (skillName: string, isOffered: boolean) => {
    const allSkills = await api.getSkills();
    const skill = allSkills.find((s: any) => s.name.toLowerCase() === skillName.toLowerCase());
    if (!skill) return alert('Skill not found');
    const userSkill = await api.createUserSkill({ skill_id: skill.id, is_offered: isOffered });
    if (isOffered) setSkillsOffered([...skillsOffered, { id: userSkill.id, name: skill.name }]);
    else setSkillsWanted([...skillsWanted, { id: userSkill.id, name: skill.name }]);
    if (isOffered) setNewOfferedSkill(''); else setNewWantedSkill('');
  };

  const removeSkill = async (userSkillId: number, isOffered: boolean) => {
    await api.deleteUserSkill(userSkillId);
    if (isOffered) setSkillsOffered(skillsOffered.filter(s => s.id !== userSkillId));
    else setSkillsWanted(skillsWanted.filter(s => s.id !== userSkillId));
  };

  if (loading || !formData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header showTabs={false} />
      {/* Action Bar */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">Edit Profile</h1>
            <div className="flex space-x-2">
              <Button onClick={() => navigate('/')} variant="outline" size="sm">
                Discard
              </Button>
              <Button onClick={handleSave} size="sm">
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Photo Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={formData.profileImage} />
                  <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    Remove Photo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select value={formData.availability} onValueChange={(value) => setFormData({...formData, availability: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Busy">Busy</SelectItem>
                      <SelectItem value="Weekends">Weekends Only</SelectItem>
                      <SelectItem value="Evenings">Evenings Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profileStatus">Profile Status</Label>
                  <Select value={formData.profileStatus} onValueChange={(value) => setFormData({...formData, profileStatus: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Public">Public</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Skills Offered */}
          <Card>
            <CardHeader>
              <CardTitle>Skills I Can Offer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {skillsOffered.map(skill => (
                    <Badge key={skill.id} variant="secondary" className="flex items-center gap-1">
                      {skill.name}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeSkill(skill.id, true)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill you can offer"
                    value={newOfferedSkill}
                    onChange={e => setNewOfferedSkill(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addSkill(newOfferedSkill, true)}
                  />
                  <Button onClick={() => addSkill(newOfferedSkill, true)} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Skills Wanted */}
          <Card>
            <CardHeader>
              <CardTitle>Skills I Want to Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {skillsWanted.map(skill => (
                    <Badge key={skill.id} variant="secondary" className="flex items-center gap-1">
                      {skill.name}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeSkill(skill.id, false)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill you want to learn"
                    value={newWantedSkill}
                    onChange={e => setNewWantedSkill(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && addSkill(newWantedSkill, false)}
                  />
                  <Button onClick={() => addSkill(newWantedSkill, false)} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
