# Discogs Requests POC

This repository is a proof-of-concept (POC) for allowing users to request releases from a user's Discogs collection. The POC is designed to be paired with the ability to listen to a stream of the currently playing turntable from another repository.

## Features

- Fetches a user's Discogs collection.
- Allows users to request releases from the collection.
- Stores collection data locally for quick access.

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)
- Discogs API credentials

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/jrdnrgrs/discogs-requests.git
    cd discogs-requests
    ```

2. Install backend dependencies:
    ```sh
    cd backend
    npm install
    ```

3. Install frontend dependencies:
    ```sh
    cd ../frontend
    npm install
    ```

### Configuration

1. Create a `.env` file in the `backend` directory with your Discogs API credentials:
    ```env
    DISCOGS_CONSUMER_KEY=your_consumer_key
    DISCOGS_CONSUMER_SECRET=your_consumer_secret
    DISCOGS_USER_TOKEN=your_user_token
    ```

### Running the Application

1. Start the backend server:
    ```sh
    cd backend
    npm start
    ```

2. Start the frontend development server:
    ```sh
    cd ../frontend
    npm start
    ```

3. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

- The backend fetches the user's Discogs collection and stores it locally.
- Users can request releases from the collection through the frontend interface.

## Future Enhancements

- Integrate with a streaming service to allow users to listen to the currently playing turntable.
- Improve the user interface for better user experience.
- Add more sorting and filtering options for the collection.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.


## Acknowledgements

- [Discogs API](https://www.discogs.com/developers/)
- [Create React App](https://create-react-app.dev/)
- [TSDiscogsTool](https://github.com/VinylVault/TSDiscogsTool)
- [Greptile](app.greptile.com)

---
