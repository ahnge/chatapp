# Chat Application

This is a simple chat application built with a React frontend and an Express backend, utilizing Socket.IO for real-time communication and openai api for chat response.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine
- Openai api key with some credits

## Setup Instructions

1.  **Clone the Repository**:
    ```
    git clone https://github.com/ahnge/chatapp.git
    ```
2.  **Move into the project directory**:
    ```
    cd chatapp
    ```
3.  **Put your openai api key**:

        Put your OPENAI_API_KEY in the .env file of the project root.

4.  **Build and run the container**:
    ```
    docker compose up --build
    ```
5.  **Access the application**:

        Open your browser and navigate to `http://localhost:3000` to start chatting with CatGPT.

## Notes

- Ensure Docker and Docker Compose are properly installed on your machine before starting.
- The application is set up to use ports `3000` for the frontend and `3001` for the backend. Ensure these ports are available on your machine.
