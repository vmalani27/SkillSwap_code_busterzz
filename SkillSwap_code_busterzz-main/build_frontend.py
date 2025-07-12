#!/usr/bin/env python3
"""
Script to build the React frontend and copy it to Django's static directory.
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

def build_frontend():
    """Build the React frontend using npm/yarn."""
    frontend_dir = Path("frontend")
    
    if not frontend_dir.exists():
        print("Error: frontend directory not found")
        sys.exit(1)
    
    print("Building frontend...")
    
    # Change to frontend directory
    original_dir = os.getcwd()
    os.chdir(frontend_dir)
    
    try:
        # Install dependencies if node_modules doesn't exist
        if not Path("node_modules").exists():
            print("Installing dependencies...")
            subprocess.run(["npm", "install"], check=True, shell=True)
        
        # Build the frontend
        print("Building for production...")
        subprocess.run(["npm", "run", "build"], check=True, shell=True)
        
        print("Frontend built successfully!")
        
    except subprocess.CalledProcessError as e:
        print(f"Error building frontend: {e}")
        sys.exit(1)
    finally:
        # Change back to root directory
        os.chdir(original_dir)

def copy_to_django():
    """Copy the built frontend to Django's static directory."""
    frontend_dist = Path("frontend/dist")
    django_static = Path("skillswap/static")
    
    if not frontend_dist.exists():
        print("Error: frontend/dist directory not found. Run build first.")
        sys.exit(1)
    
    # Create Django static directory if it doesn't exist
    django_static.mkdir(exist_ok=True)
    
    print("Copying frontend build to Django static directory...")
    
    # Remove existing static files
    if django_static.exists():
        shutil.rmtree(django_static)
    
    # Copy the entire dist directory
    shutil.copytree(frontend_dist, django_static)
    
    print("Frontend copied to Django static directory successfully!")

def main():
    """Main function to build and copy frontend."""
    print("Starting frontend build and integration...")
    
    build_frontend()
    copy_to_django()
    
    print("Frontend integration completed successfully!")
    print("You can now run Django with: python skillswap/manage.py runserver")

if __name__ == "__main__":
    main() 