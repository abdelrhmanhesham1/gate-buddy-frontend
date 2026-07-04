import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App.jsx';
import { AuthProvider } from "./context/AuthContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import '../node_modules/@popperjs/core/dist/umd/popper.min.js';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import '../src/components/style/index.css';

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "1061190441173-9drkg312m1ar2c96iupalk85ckpcdljm.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);

