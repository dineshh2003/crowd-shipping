// This file re-exports the useAuth hook from the AuthContext
import { useAuth as useAuthFromContext } from '../context/AuthContext';

// Re-export the hook
export const useAuth = useAuthFromContext;

// Export default for convenience
export default useAuth;