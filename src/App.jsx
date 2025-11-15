import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import DocumentList from './components/Documents/DocumentList';
import DocumentDetail from './components/Documents/DocumentDetail';
import ProjectList from './components/Projects/ProjectList';
import Settings from './components/Settings/Settings';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Common/ProtectedRoute';
import NotFound from './components/ErrorPages/NotFound';
import ErrorBoundary from './components/Common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/documents" element={<DocumentList />} />
            <Route path="/documents/:id" element={<DocumentDetail />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;