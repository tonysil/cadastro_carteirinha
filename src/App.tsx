import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import RegistrationForm from "./components/RegistrationForm";
import AssociatesPage from "./pages/Associates";
import PrintCard from "./pages/PrintCard";
import CardTemplateEditor from "./pages/CardTemplateEditor";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuth from "./hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import AddDependentForm from "./components/associates/AddDependentForm";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Index />} />
              <Route path="registro" element={<RegistrationForm />} />
              <Route path="associados" element={<AssociatesPage />} />
              <Route path="associados/:associateId/dependentes/adicionar" element={<AddDependentForm />} />
              <Route path="carteirinha/:id" element={<PrintCard />} />
              <Route path="editor-carteirinha" element={<CardTemplateEditor />} />
              <Route
                path="admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          )}
        </Routes>
        <Toaster />
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;