import time
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import logout
from django.http import JsonResponse
from django.conf import settings

class SessionTimeoutMiddleware(MiddlewareMixin):
    """
    Middleware to handle session timeout and authentication checks
    """
    
    def process_request(self, request):
        # Skip for non-authenticated users
        if not request.user.is_authenticated:
            return None
            
        # Skip for API endpoints that don't require authentication
        if request.path.startswith('/api/health/') or request.path.startswith('/api/signup/health/'):
            return None
            
        # Check if session exists
        if not request.session.session_key:
            print(f"[Middleware] No session found for user {request.user}")
            logout(request)
            return None
            
        # Check session timeout
        current_time = time.time()
        last_activity = request.session.get('last_activity', current_time)
        
        # Update last activity
        request.session['last_activity'] = current_time
        
        # Check if session has expired (30 minutes)
        if current_time - last_activity > settings.SESSION_IDLE_TIMEOUT:
            print(f"[Middleware] Session expired for user {request.user}")
            logout(request)
            
            # Return JSON response for API requests
            if request.path.startswith('/api/'):
                return JsonResponse({
                    'error': 'Session expired',
                    'message': 'Please log in again'
                }, status=401)
            
            return None
            
        return None

class SessionActivityMiddleware(MiddlewareMixin):
    """
    Middleware to track session activity and ensure session is saved
    """
    
    def process_request(self, request):
        # Ensure session is created if user is authenticated
        if request.user.is_authenticated and not request.session.session_key:
            request.session.create()
            print(f"[Middleware] Created new session for user {request.user}")
            
        # Update session activity timestamp
        if request.user.is_authenticated:
            request.session['last_activity'] = time.time()
            
        return None
    
    def process_response(self, request, response):
        # Save session if user is authenticated
        if request.user.is_authenticated and request.session.modified:
            request.session.save()
            print(f"[Middleware] Saved session for user {request.user}")
            
        return response 