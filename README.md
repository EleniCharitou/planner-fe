# TravelPlanner Frontend
[![React: 19.0](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Vite: 6.2](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![TypeScript: 5.7](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind: 4.0](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

The client-side interface for TravelPlanner, built for a fluid, interactive trip-planning and journaling experience. This application features a Kanban-style board for itinerary management, secure authentication flows, and responsive design.  

* * *

## 🛠️ Getting Started  
  
### 1\. Prerequisites
* **Node.js (LTS):** Required for the runtime environment and `npm` package manager.

### 2\. Installation & Setup
Clone the repository and navigate to the frontend directory:
```
# Install project dependencies
npm install

# Configure environment
cp .env.template .env

# Run project
    npm run dev
```
The application will be available at `http://localhost:5173`.  

* * *

⚙️ Development Standards

* **Drag & Drop:** Implemented using `@dnd-kit` for accessible, modular reordering logic.

* **Testing:** Continuous quality assurance via `Vitest` and `SonarQube` integration.

* **Authentication:** `JWT-based` session management with automatic `axios` interceptors for secure API communication.

### Project Scripts

| **Command** | **Description** |
| --- | --- |
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Builds the production-ready application |
| `npm run test` | Executes the Vitest testing suite |
| `npm run preview` | Previews the production build locally |
