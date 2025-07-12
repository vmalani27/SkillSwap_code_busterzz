# SkillSwap - Django + React Integration

This project integrates a Django backend with a React frontend, providing a full-stack web application for skill sharing and networking.

## Project Structure

```
├── skillswap/          # Django backend
│   ├── core/          # Main Django app
│   ├── skillswap/     # Django project settings
│   └── templates/     # Django templates
├── frontend/          # React frontend
│   ├── src/          # React source code
│   └── dist/         # Built React files
├── build_frontend.py  # Script to build and integrate frontend
├── dev_server.py      # Development server script
└── requirements.txt   # Python dependencies
```

## Features

- **Django Backend**: REST API with authentication
- **React Frontend**: Modern UI with TypeScript and Tailwind CSS
- **Authentication**: Token-based authentication
- **API Integration**: Seamless communication between frontend and backend
- **Development Mode**: Hot reloading for both frontend and backend

## Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL (for database)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd SkillSwap_code_busterzz-main
```

### 2. Set up Django backend
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
cd skillswap
pip install -r requirements.txt

# Set up database
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### 3. Set up React frontend
```bash
# Install Node.js dependencies
cd ../frontend
npm install
```

## Development

### Option 1: Separate Development Servers (Recommended for development)

Run both servers simultaneously:

```bash
# From the root directory
python dev_server.py
```

This will start:
- Django server on http://localhost:8000
- React dev server on http://localhost:8080

### Option 2: Integrated Production Build

Build the frontend and serve it through Django:

```bash
# Build frontend and copy to Django
python build_frontend.py

# Run Django server
cd skillswap
python manage.py runserver
```

Visit http://localhost:8000 to see the integrated application.

## API Endpoints

The Django backend provides the following REST API endpoints:

- `POST /api/register/` - User registration
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout
- `GET /api/profile/` - Get user profile
- `PUT /api/profile/` - Update user profile

## Frontend Development

The React frontend includes:

- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Modern UI components
- **React Router**: Client-side routing
- **React Query**: Data fetching and caching

### Key Files:

- `frontend/src/lib/api.ts` - API client for Django communication
- `frontend/src/contexts/AuthContext.tsx` - Authentication state management
- `frontend/src/components/` - Reusable UI components

## Production Deployment

### 1. Build the frontend
```bash
python build_frontend.py
```

### 2. Configure Django for production
- Set `DEBUG = False` in settings.py
- Configure `ALLOWED_HOSTS`
- Set up proper database
- Configure static files serving

### 3. Deploy
- Use a production WSGI server (Gunicorn, uWSGI)
- Set up a reverse proxy (Nginx, Apache)
- Configure SSL certificates

## Environment Variables

Create a `.env` file in the frontend directory for development:

```env
VITE_API_URL=http://localhost:8000/api
```

## Database Configuration

The project uses PostgreSQL. Update the database settings in `skillswap/skillswap/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'SkillSwap',
        'USER': 'postgres',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## Troubleshooting

### Common Issues:

1. **CORS errors**: Ensure Django CORS settings are configured correctly
2. **Static files not loading**: Run `python manage.py collectstatic`
3. **Database connection**: Verify PostgreSQL is running and credentials are correct
4. **Frontend build errors**: Check Node.js version and dependencies

### Development Tips:

- Use browser dev tools to inspect API requests
- Check Django logs for backend errors
- Use React dev tools for frontend debugging
- Monitor network tab for CORS issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 