import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, AlertTriangle } from 'lucide-react';

interface SessionStatus {
  authenticated: boolean;
  time_remaining?: number;
  session_valid?: boolean;
  message?: string;
}

const SessionManager = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  const checkSession = async () => {
    try {
      const response = await fetch('http://172.16.91.34:8000/api/session-check/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSessionStatus(data);
        
        // Show warning if session expires in less than 5 minutes
        if (data.time_remaining && data.time_remaining < 300) {
          setShowWarning(true);
        } else {
          setShowWarning(false);
        }
        
        // Redirect to login if session expired
        if (!data.authenticated && data.expired) {
          navigate('/login');
        }
      } else {
        setSessionStatus({ authenticated: false, message: 'Session check failed' });
      }
    } catch (error) {
      console.error('Session check error:', error);
      setSessionStatus({ authenticated: false, message: 'Session check error' });
    }
  };

  const extendSession = async () => {
    try {
      // Make any API call to extend the session
      await fetch('http://172.16.91.34:8000/api/users/profile/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
      });
      
      // Recheck session status
      await checkSession();
      setShowWarning(false);
    } catch (error) {
      console.error('Failed to extend session:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkSession();
      
      // Check session every minute
      const interval = setInterval(checkSession, 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || !showWarning) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Alert className="w-80">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Session Expiring Soon</p>
              <p className="text-sm text-muted-foreground">
                Your session will expire in {sessionStatus?.time_remaining ? formatTime(sessionStatus.time_remaining) : 'unknown'} minutes
              </p>
            </div>
            <Button size="sm" onClick={extendSession}>
              Extend Session
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SessionManager; 