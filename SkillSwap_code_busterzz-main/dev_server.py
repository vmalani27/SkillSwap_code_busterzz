#!/usr/bin/env python3
"""
Development script to run both Django and React development servers.
"""

import os
import subprocess
import sys
import time
import threading
from pathlib import Path

def run_django_server():
    """Run Django development server."""
    os.chdir("skillswap")
    try:
        subprocess.run(["python", "manage.py", "runserver"], check=True)
    except KeyboardInterrupt:
        print("\nDjango server stopped.")
    except subprocess.CalledProcessError as e:
        print(f"Error running Django server: {e}")

def run_react_dev_server():
    """Run React development server."""
    os.chdir("frontend")
    try:
        subprocess.run(["npm", "run", "dev"], check=True)
    except KeyboardInterrupt:
        print("\nReact dev server stopped.")
    except subprocess.CalledProcessError as e:
        print(f"Error running React dev server: {e}")

def main():
    """Main function to run both servers."""
    print("Starting development servers...")
    print("Django will run on http://localhost:8000")
    print("React dev server will run on http://localhost:8080")
    print("Press Ctrl+C to stop both servers")
    
    # Start Django server in a separate thread
    django_thread = threading.Thread(target=run_django_server)
    django_thread.daemon = True
    django_thread.start()
    
    # Give Django a moment to start
    time.sleep(2)
    
    # Start React dev server in main thread
    run_react_dev_server()

if __name__ == "__main__":
    main() 