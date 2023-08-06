# xks deployment

Multiple configurations can be used to deploy various parts of xks depending on the individual developer or server needs.
All of them assume a functioning Docker installation with a recent version of Docker Compose.

### Frontend development
To start a backend and a database instance for frontend development, use the script ```frontend-dev.sh``` in this folder.
The frontend itself can then be started with ```yarn run start``` inside the app folder.

### Backend (and frontend) development
In order to only start the database for backend development (and optionally for the frontend), use the command below.
Use the script ```backend-dev.sh``` in this folder to launch a database instance and activate Spring profiles ```development``` and ```local``` before starting the backend.
The frontend can then be started as usual with ```yarn run start``` in the app folder.

### Production deployment
Only to be used in production environments, does not work locally without an appropriate HTTPS setup.
Starts everything needed for a fully functioning xks instance.
Refer to the contents of ```compose-production.yaml``` for the deployment settings and preset variables (for database credentials, host URL etc.).
Use the script ```production.sh``` as a reference of sensible variable presets and helper for production deployments. 
