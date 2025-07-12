
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Moon, Sun, User, Home, MessageSquare, Mail, Users } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  showTabs?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showTabs = true }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/dashboard') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Left: Logo + App Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <Link to="/dashboard" className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
              Skill Swap Platform
            </Link>
          </div>

          {/* Center: Navigation Tabs */}
          {showTabs && (
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/dashboard">
                <Button
                  variant={isActive('/dashboard') ? 'default' : 'ghost'}
                  size="lg"
                  className="flex items-center space-x-2 font-medium text-base px-6"
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Button>
              </Link>
              <Link to="/swap-requests">
                <Button
                  variant={isActive('/swap-requests') ? 'default' : 'ghost'}
                  size="lg"
                  className="flex items-center space-x-2 font-medium text-base px-6"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Swap Requests</span>
                </Button>
              </Link>
              <Link to="/messages">
                <Button
                  variant={isActive('/messages') ? 'default' : 'ghost'}
                  size="lg"
                  className="flex items-center space-x-2 font-medium text-base px-6"
                >
                  <Mail className="h-5 w-5" />
                  <span>Messages</span>
                </Button>
              </Link>
            </div>
          )}
          
          {/* Right: Theme Toggle + Profile */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-11 h-11 text-xl"
            >
              {theme === 'light' ? '🌙' : '🌞'}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-11 h-11">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=40&h=40&fit=crop&crop=face" />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full">
                    <User className="mr-3 h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/login" className="w-full">
                    Sign Out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {showTabs && (
          <div className="flex md:hidden space-x-1 pb-3">
            <Link to="/dashboard">
              <Button
                variant={isActive('/dashboard') ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center space-x-2 font-medium"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
            <Link to="/swap-requests">
              <Button
                variant={isActive('/swap-requests') ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center space-x-2 font-medium"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Requests</span>
              </Button>
            </Link>
            <Link to="/messages">
              <Button
                variant={isActive('/messages') ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center space-x-2 font-medium"
              >
                <Mail className="h-4 w-4" />
                <span>Messages</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
