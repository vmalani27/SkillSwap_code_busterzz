import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SessionTest = () => {
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [profileInfo, setProfileInfo] = useState<any>(null);
  const [createSessionInfo, setCreateSessionInfo] = useState<any>(null);
  const [cookieInfo, setCookieInfo] = useState<any>(null);
  const [authTestInfo, setAuthTestInfo] = useState<any>(null);
  const [simpleAuthTestInfo, setSimpleAuthTestInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSession = async () => {
    setLoading(true);
    try {
      console.log('[Frontend] Testing session...');
      const response = await fetch('http://172.16.91.34:8000/api/session-test/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
      });
      
      const data = await response.json();
      console.log('[Frontend] Session test response:', data);
      setSessionInfo(data);
    } catch (error) {
      console.error('[Frontend] Session test error:', error);
      setSessionInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testProfile = async () => {
    setLoading(true);
    try {
      console.log('[Frontend] Testing profile endpoint...');
      const response = await fetch('http://172.16.91.34:8000/api/users/profile/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
      });
      
      const data = await response.json();
      console.log('[Frontend] Profile test response:', data);
      setProfileInfo(data);
    } catch (error) {
      console.error('[Frontend] Profile test error:', error);
      setProfileInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testCreateSession = async () => {
    setLoading(true);
    try {
      console.log('[Frontend] Testing session creation...');
      const response = await fetch('http://172.16.91.34:8000/api/create-session/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
      });
      
      const data = await response.json();
      console.log('[Frontend] Create session response:', data);
      setCreateSessionInfo(data);
    } catch (error) {
      console.error('[Frontend] Create session error:', error);
      setCreateSessionInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testCookies = async () => {
    setLoading(true);
    try {
      console.log('[Frontend] Testing cookies...');
      const response = await fetch('http://172.16.91.34:8000/api/cookie-test/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
      });
      
      const data = await response.json();
      console.log('[Frontend] Cookie test response:', data);
      setCookieInfo(data);
    } catch (error) {
      console.error('[Frontend] Cookie test error:', error);
      setCookieInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    try {
      console.log('[Frontend] Testing authentication...');
      
      // First, try to login
      const loginResponse = await fetch('http://172.16.91.34:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
          username: 'vanshmalani24',
          password: 'your_password_here' // You'll need to replace this
        }),
      });
      
      console.log('[Frontend] Login response status:', loginResponse.status);
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('[Frontend] Login successful:', loginData);
        
        // Now try to access profile
        const profileResponse = await fetch('http://172.16.91.34:8000/api/users/profile/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          credentials: 'include',
        });
        
        const profileData = await profileResponse.json();
        console.log('[Frontend] Profile response:', profileData);
        
        setAuthTestInfo({
          login_successful: true,
          login_data: loginData,
          profile_status: profileResponse.status,
          profile_data: profileData
        });
      } else {
        const loginError = await loginResponse.json();
        setAuthTestInfo({
          login_successful: false,
          login_error: loginError
        });
      }
    } catch (error) {
      console.error('[Frontend] Auth test error:', error);
      setAuthTestInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testSimpleAuth = async () => {
    setLoading(true);
    try {
      console.log('[Frontend] Testing simple auth...');
      const response = await fetch('http://172.16.91.34:8000/api/auth-test/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
      });
      
      const data = await response.json();
      console.log('[Frontend] Simple auth test response:', data);
      setSimpleAuthTestInfo(data);
    } catch (error) {
      console.error('[Frontend] Simple auth test error:', error);
      setSimpleAuthTestInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Session Authentication Debug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4 flex-wrap">
              <Button onClick={testSession} disabled={loading}>
                Test Session
              </Button>
              <Button onClick={testCreateSession} disabled={loading}>
                Create Session
              </Button>
              <Button onClick={testCookies} disabled={loading}>
                Test Cookies
              </Button>
              <Button onClick={testProfile} disabled={loading}>
                Test Profile Endpoint
              </Button>
              <Button onClick={testAuth} disabled={loading}>
                Test Full Auth Flow
              </Button>
              <Button onClick={testSimpleAuth} disabled={loading}>
                Test Simple Auth
              </Button>
            </div>
            
            {sessionInfo && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Session Test Results:</h3>
                <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(sessionInfo, null, 2)}
                </pre>
              </div>
            )}
            
            {createSessionInfo && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Create Session Results:</h3>
                <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(createSessionInfo, null, 2)}
                </pre>
              </div>
            )}
            
            {cookieInfo && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Cookie Test Results:</h3>
                <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(cookieInfo, null, 2)}
                </pre>
              </div>
            )}
            
            {authTestInfo && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Auth Test Results:</h3>
                <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(authTestInfo, null, 2)}
                </pre>
              </div>
            )}
            
            {simpleAuthTestInfo && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Simple Auth Test Results:</h3>
                <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(simpleAuthTestInfo, null, 2)}
                </pre>
              </div>
            )}
            
            {profileInfo && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Profile Test Results:</h3>
                <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(profileInfo, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionTest; 