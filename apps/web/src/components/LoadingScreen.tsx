import iconSvg from '../assets/logo.svg';

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center space-y-6">
        <img 
          src={iconSvg} 
          alt="Mbit ERP Logo" 
          className="h-24 w-24 animate-pulse"
        />
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 border-4 border-mbit-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm mt-2">Alkalmazás indítása...</p>
        </div>
      </div>
    </div>
  );
}

