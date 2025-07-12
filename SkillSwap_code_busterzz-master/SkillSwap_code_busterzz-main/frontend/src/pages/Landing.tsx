
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Users, Search, MessageSquare, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

const Landing = () => {
  const { theme, toggleTheme } = useTheme();
  const [currentSkill, setCurrentSkill] = useState(0);

  const popularSkills = [
    'JavaScript', 'Python', 'Photoshop', 'UI/UX Design', 'Photography', 
    'Content Writing', 'Digital Marketing', 'Video Editing', 'Graphic Design', 'React'
  ];

  const nextSkill = () => {
    setCurrentSkill((prev) => (prev + 1) % Math.ceil(popularSkills.length / 3));
  };

  const prevSkill = () => {
    setCurrentSkill((prev) => (prev - 1 + Math.ceil(popularSkills.length / 3)) % Math.ceil(popularSkills.length / 3));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Skill Swap Platform</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="w-9 h-9"
              >
                {theme === 'light' ? '🌙' : '🌞'}
              </Button>
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700">
                  Sign Up
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">Explore</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Trade skills,
            <span className="bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent"> not money</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect with like-minded learners, share your expertise, and grow together in a community where knowledge is the only currency.
          </p>
          
          <div className="w-full max-w-md mx-auto mb-12 bg-gradient-to-br from-teal-50 to-indigo-50 dark:from-teal-950 dark:to-indigo-950 rounded-2xl p-8 border border-teal-200 dark:border-teal-800">
            <div className="text-6xl mb-4">🤝</div>
            <p className="text-sm text-muted-foreground">Join 10,000+ skill swappers worldwide</p>
          </div>

          <Link to="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-4xl font-bold text-center text-foreground mb-12">How It Works</h3>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center border-2 border-teal-200 dark:border-teal-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-4">Create a Profile</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Showcase your skills and specify what you'd like to learn. It's your gateway to the community.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-indigo-200 dark:border-indigo-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-4">Offer & Request Skills</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Browse profiles, find perfect matches, and send swap requests to start meaningful exchanges.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 border-amber-200 dark:border-amber-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-4">Connect & Grow</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Chat, schedule sessions, and grow together. Build lasting connections through shared learning.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Skills */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-4xl font-bold text-center text-foreground mb-12">Popular Skills</h3>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSkill}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSkill}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {popularSkills.slice(currentSkill * 3, (currentSkill + 1) * 3).map((skill, index) => (
                <Card key={skill} className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-teal-300 dark:hover:border-teal-700">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-3">
                      {index === 0 ? '💻' : index === 1 ? '🎨' : '📱'}
                    </div>
                    <h4 className="text-lg font-bold text-foreground mb-2">{skill}</h4>
                    <div className="flex items-center justify-center space-x-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">1,234+ learners</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Skill Swap Platform</h1>
            </div>
            
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">About</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact Us</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Skill Swap Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
