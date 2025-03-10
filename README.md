This project is a web application built using React, FastAPI, and Docker, with data visualization using Chart.js. It includes user authentication, protected routes, CSV uploading, and dashboard metrics.

🛠 Setup Instructions
Since the project is containerized with Docker, you can start everything with: docker-compose up --build

🚀 Technical Choices

Frontend: React

Due to its ability to efficiently handle data changes and state management through React Hooks.
Protected Routes ensure only authenticated users can access the dashboard.
Integrated Chart.js (via react-chartjs-2) to visualize real-time metrics.


Backend: FastAPI

Chosen for its simplicity and speed compared to other frameworks like Flask.
Built core API endpoints for authentication, CSV upload handling, and sales summary.
Provides metrics calculation for CSV data analysis.

Containerization: Docker

Docker Compose is used to containerize both the frontend and backend, ensuring portability and consistency across different environments.
Simplifies deployment with a single command.

Data Visualization: Chart.js

Integrated Chart.js into React to dynamically generate dashboard metrics.
Ensures smooth user experience with interactive visualizations.
React Hooks manage real-time data updates efficiently.



## Estimated Time Spent

| Feature                        | Estimated Time | Actual Time Taken |
|--------------------------------|---------------|-------------------|
| **Backend - Auth**             | 3H            | 3H                |
| **Backend - Sales + Summary**  | 4H            | 2H                |
| **Backend - Metrics**          | 3H            | 2H                |
| **Frontend - Auth**            | 5H            | 2H30              |
| **Frontend - Dashboard (LineChart + BarChart)** | 4H        | 2H30 |
| **Frontend - Metrics**         | 3H            | 2H                |
| **Frontend - Template & UI**   | 2H            | 2H                |

📀 **Total Estimated Time:** 24H  
📄 **Total Time Taken:** 15H  

---

Thank you for this opportunity, I truly appreciated the experience and enjoyed working on it. 🚀
