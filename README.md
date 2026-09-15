This project is a full-stack survey application built with React, FastAPI, PostgreSQL, and Node.js.




-   **`client/`**: React frontend (Vite)


-   **`api/`**: FastAPI backend (Python)


-   **`worker/`**: Node.js background jobs


-   **`db/`**: PostgreSQL schema and seed files




---




## Project Setup





### Prerequisites




Before you begin, ensure you have the following installed:




1.  **Node.js**: [Download Node.js](https://nodejs.org/) (LTS version recommended)


2.  **Python**: [Download Python](https://www.python.org/downloads/) (version 3.8+)


3.  **PostgreSQL**: [Download PostgreSQL](https://www.postgresql.org/download/)


4.  **Git**: [Download Git](https://git-scm.com/downloads/)




### 1. Clone the Repository




```bash


git clone <your-repository-url>


cd PM-2026-S1-LIGHTHOUSE-LEADERS/survey-app


```





### 2. Configure Environment Variables





Create a `.env` file in the root directory by copying the example:








Edit the `.env` file and set your `DATABASE_URL` with the correct username, password, and database name.





### 3. Set Up PostgreSQL





Connect to PostgreSQL and create the database and user you specified in your `.env` file.




**On Linux/macOS:**










```bash


# Connect as the postgres superuser


sudo -u postgres psql







# Inside psql, run these commands (replace with your actual values):


CREATE DATABASE lighthouse_app;


CREATE USER lighthouse_user WITH PASSWORD 'your_strong_password';


GRANT ALL PRIVILEGES ON DATABASE lighthouse_leaders_app TO lighthouse_user;


\q







```




**On Windows:**


Use the `SQL Shell (psql)` application that comes with the PostgreSQL installer. You will be prompted for the server, database, user, and password. Once connected, run the SQL commands above.





### 4. Set Up the Backend (FastAPI)





```bash


cd api





# Create and activate a virtual environment


# On Linux/macOS:


python3 -m venv .venv


source .venv/bin/activate





# On Windows:


python -m venv venv


venv\Scripts\activate





# Install dependencies


pip install -r requirements.txt





# Create database tables


python init_db.py


```





### 5. Set Up the Frontend (React)





```bash


cd client





# Install dependencies


npm install


```








---





## Running the Application in Development





You will need to run each part of the application in a separate terminal.





**Terminal 1: Run the Backend**





```bash


cd api


source .venv/bin/activate  # or .\venv\Scripts\activate on Windows

#update
uvicorn api.main:app --reload --port 5000

```





**Terminal 2: Run the Frontend**





```bash


cd client


npm run dev

```


The frontend will be available at `http://localhost:5173`.
