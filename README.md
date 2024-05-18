# Chat Application

This is a simple chat application built with a React frontend and an Express backend, utilizing Socket.IO for real-time communication and fetching random quotes from an external API.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine

## Setup Instructions

1.  **Clone the Repository**:
    ```
    git clone https://github.com/ahnge/chatapp.git
    cd chatapp
    ```
2.  **Build and run the container**:
    ```
    docker-compose up --build
    ```
3.  **Access the application**:
    Open your browser and navigate to `http://localhost:3000` to use the application.

## Notes

- Ensure Docker and Docker Compose are properly installed on your machine before starting.
- The application is set up to use ports `3000` for the frontend and `3001` for the backend. Ensure these ports are available on your machine.
