# Personal Portfolio Website

This repository contains the source code for my personal portfolio website, built with modern web technologies. It showcases my projects, skills, and provides a way to contact me.

## Features

*   **Interactive UI:** Custom cursor and 3D elements for an engaging user experience.
*   **Modular Sections:** Dedicated sections for Hero, Portfolio, Process, Services, Contact, and Tech Stack.
*   **Responsive Design:** Optimized for various screen sizes.
*   **Built with React & TypeScript:** Leveraging a robust and scalable front-end stack.

## Technologies Used

*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
*   **Vite:** A fast build tool that provides a lightning-fast development experience.
*   **Three.js:** (Likely used for `ThreeScene.tsx`) A JavaScript 3D library for displaying 3D graphics in the browser.
*   **SCSS/CSS Modules:** For styling components. (Assuming based on typical React projects, could be checked later if needed)

## Project Structure

```
.
├── public/                 // Static assets (images, etc.)
├── src/
│   ├── components/         // Reusable UI components
│   │   ├── CustomCursor.tsx
│   │   ├── Navigation.tsx
│   │   ├── ThreeScene.tsx  // 3D scene component
│   │   └── UI/             // Generic UI elements
│   │       ├── ScrollToTop.tsx
│   │       └── SystemStatus.tsx
│   ├── sections/           // Major sections of the portfolio
│   │   ├── Contact.tsx
│   │   ├── Hero.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Process.tsx
│   │   ├── Services.tsx
│   │   └── TechStack.tsx
│   ├── App.tsx             // Main application component
│   ├── index.css           // Global styles (if any)
│   ├── index.tsx           // Entry point of the React application
│   └── vite-env.d.ts       // Vite environment type definitions
├── index.html              // Main HTML file
├── package.json            // Project dependencies and scripts
├── tsconfig.json           // TypeScript configuration
├── vite.config.ts          // Vite configuration
└── README.md               // This file
```

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or pnpm (pnpm is used in `pnpm-lock.yaml`)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-portfolio.git
    cd your-portfolio
    ```
    *(Replace `https://github.com/your-username/your-portfolio.git` with the actual repository URL)*

2.  **Install dependencies:**
    ```bash
    pnpm install
    # or npm install
    ```

### Running the Development Server

1.  **Start the development server:**
    ```bash
    pnpm run dev
    # or npm run dev
    ```

2.  Open your browser and navigate to `http://localhost:5173` (or the address shown in your terminal).

## Deployment

*(Add instructions here for deploying your portfolio, e.g., to Netlify, Vercel, GitHub Pages, etc.)*

## Contact

Feel free to reach out to me via [LinkedIn](your-linkedin-profile) or [Email](your-email@example.com).

## License

This project is licensed under the [MIT License](LICENSE).
