import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { isModuleEnabled, getModuleRoutes } from '../config/modules';

interface ModuleRouteGuardProps {
  module: 'documents' | 'team' | 'crm' | 'logistics' | 'controlling';
  children: ReactNode;
}

/**
 * Route guard komponens, amely ellenőrzi, hogy a modul engedélyezve van-e.
 * Ha nem engedélyezett, akkor redirectál a főoldalra.
 */
export function ModuleRouteGuard({ module, children }: ModuleRouteGuardProps) {
  const location = useLocation();
  
  // Ellenőrizzük, hogy a modul engedélyezve van-e
  if (!isModuleEnabled(module)) {
    // Logoljuk a próbálkozást (csak development módban)
    if (import.meta.env.DEV) {
      console.warn(`Module ${module} is not enabled. Redirecting from ${location.pathname} to home.`);
    }
    
    // Redirect a főoldalra
    return <Navigate to="/" replace />;
  }
  
  // További ellenőrzés: a jelenlegi route valóban a modulhoz tartozik-e
  const moduleRoutes = getModuleRoutes(module);
  if (!moduleRoutes.includes(location.pathname)) {
    // Ha a route nem tartozik a modulhoz, akkor is engedélyezzük (pl. nested routes)
    // Ez biztosítja, hogy a modul al-route-jai is működjenek
  }
  
  return <>{children}</>;
}

/**
 * Hook a modul engedélyezés ellenőrzéséhez
 */
export function useModuleAccess(module: 'documents' | 'team' | 'crm' | 'logistics' | 'controlling'): boolean {
  return isModuleEnabled(module);
}

