import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/member/login" replace />;
  if (!currentUser.isAdmin) return <Navigate to="/student/dashboard" replace />;
  return children;
};

export default AdminRoute;
