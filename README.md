# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

src/
├── App.jsx (main router)
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   └── Navigation.jsx
│   ├── map/
│   │   ├── MapView.jsx
│   │   ├── LotTooltip.jsx
│   │   └── ProjectMarker.jsx
│   ├── viewer/
│   │   ├── ModelViewer.jsx
│   │   ├── Model3D.jsx
│   │   ├── ViewerControls.jsx
│   │   └── GroundPlane.jsx
│   ├── projects/
│   │   ├── ProjectManager.jsx
│   │   ├── ProjectTable.jsx
│   │   ├── ProjectForm.jsx
│   │   └── ProjectMetadata.jsx
│   └── common/
│       ├── LoadingSpinner.jsx
│       ├── StatusBadge.jsx
│       └── Modal.jsx
├── pages/
│   ├── HomePage.jsx (map view)
│   ├── ViewerPage.jsx (3D viewer)
│   ├── ProjectsPage.jsx (project management)
│   └── ProjectDetailPage.jsx (metadata editing)
├── hooks/
│   ├── useProjects.js
│   ├── useIterations.js
│   └── useMapData.js
└── utils/
    ├── api.js
    └── mapHelpers.js# mid-zoning-ui
