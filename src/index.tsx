import './index.css';
import React from "react";
import { render } from "react-dom";
import App from "./App"
import { ToastProvider } from './context/ToastContext';

render(
    <React.StrictMode>
        <ToastProvider>
            <App />
        </ToastProvider>
    </React.StrictMode>,
    document.getElementById("root")
);