# Mystique Compass

Mystique Compass is a web application that provides cosmic profile analysis, including astrology, numerology, psychomatrix, and fate map insights. Users can input their name, birth date, and gender to generate a detailed cosmic profile and download a PDF report.

## Installation

To set up and run Mystique Compass locally, follow these steps:

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)

### 1. Clone the repository

```bash
git clone <repository_url>
cd Mystique-Compass
```

### 2. Install Dependencies

Mystique Compass uses pnpm workspaces. Navigate to the root directory of the cloned repository and install the dependencies:

```bash
pnpm install
```

If you encounter any issues with `pnpm install`, you might need to approve builds:

```bash
pnpm approve-builds
pnpm install
```

### 3. Build the Project

Before running the application, you need to build the project. This will compile the TypeScript code and create the necessary bundles.

```bash
export PORT=3000 # You can choose any available port
export BASE_PATH=/ # Set your base path, typically '/'
pnpm run build
```

### 4. Run the API Server

Navigate to the `artifacts/api-server` directory and start the API server. It's recommended to run this in a separate terminal or in the background.

```bash
cd artifacts/api-server
export PORT=5000 # Or any other available port
pnpm run start
```

### 5. Run the Frontend Application

Navigate to the `artifacts/mystique` directory and start the frontend development server. This will serve the web application.

```bash
cd artifacts/mystique
export PORT=3000 # Must match the PORT used during build if not using default
export BASE_PATH=/ # Must match the BASE_PATH used during build
pnpm run dev
```

### 6. Access the Application

Once both the API server and the frontend are running, you can access the Mystique Compass web application in your browser at `http://localhost:3000` (or the port you specified for the frontend).

## Project Structure

The project is structured as a pnpm workspace with the following key directories:

- `artifacts/api-server`: Contains the backend API server.
- `artifacts/mockup-sandbox`: Contains a mockup sandbox environment.
- `artifacts/mystique`: Contains the main frontend web application.
- `lib/*`: Contains shared libraries and utilities.
- `scripts`: Contains various utility scripts.

## Testing

The application was tested by:

1.  Installing dependencies.
2.  Building the project.
3.  Starting the API server.
4.  Starting the frontend application.
5.  Navigating to the application in a web browser.
6.  Filling out the cosmic profile form with sample data (Name: John Doe, Day: 15, Month: 05, Year: 1990, Gender: Male).
7.  Verifying that the cosmic profile was generated and displayed correctly.
8.  Downloading the PDF report.

All functionalities were confirmed to be working as expected.
