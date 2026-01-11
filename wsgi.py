import os
import sys
project_dir = os.path.dirname(os.path.abspath(__file__))
if project_dir not in sys.path:
    sys.path.append(project_dir)
from app import app
application = app
if __name__ == "__main__":
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    app.run(debug=debug)