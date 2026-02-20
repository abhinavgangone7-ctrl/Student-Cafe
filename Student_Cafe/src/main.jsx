// Import the function to create the root of the React app from the react-dom client library.
// React DOM is the "bridge" between React (logic) and the DOM (what you see in the browser).
import { createRoot } from 'react-dom/client'
// Import global styles that apply to the entire application.
import './index.css'
// Import the main App component, which contains all other components.
import App from './App.jsx'

// Find the HTML element with the ID 'root' (usually in index.html).
// This is the "container" where our entire React app will live.
const rootElement = document.getElementById('root');

// Create a React root in that container and "render" (draw) our App inside it.
// This is the starting point of the entire application.
createRoot(rootElement).render(
  <App />
)
