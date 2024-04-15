# PDF Generator API

This is a web service built with Node.js and Express to generate PDF files from HTML content using Puppeteer.

## Installation

1. Clone this repository to your local machine:

    ```bash
    git clone <repository-url>
    ```

2. Install dependencies using npm:

    ```bash
    npm install
    ```

## Usage

1. Start the server:

    ```bash
    node server.js
    ```

2. Access the service in your web browser or make POST requests to `/generate-pdf` endpoint to generate PDF files from HTML content.

## Endpoints

### `/generate-pdf`

- **Method**: POST
- **Description**: Generates a PDF file from HTML content provided in the request body.
- **Request Body**:
    - `htmlContent`: HTML content to be converted into a PDF.
- **Response**: PDF file as a binary buffer.

## Dependencies

- **Express**: For building the web server.
- **Body-parser**: Middleware for parsing request bodies.
- **Puppeteer**: For controlling headless Chrome to generate PDFs.
- **Cors**: Middleware for enabling Cross-Origin Resource Sharing.
- **Path**: For handling file paths.

## Configuration

- The server listens on the port specified in the `PORT` environment variable or defaults to port 3000.
- The server serves static files from the 'public' directory.
- The payload size limit for request bodies is set to 50MB.

