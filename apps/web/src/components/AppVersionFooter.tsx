import { getClientVersionLabel } from '../config/version';
import { getActivePackage, getPackageDisplayInfo } from '../config/modules';

export function AppVersionFooter({ className = '' }: { className?: string }) {
  const pkg = getPackageDisplayInfo();
  const isGinop = getActivePackage() === 'ginop-crm-dms-hr';

  return (
    <footer
      className={`text-xs text-gray-500 border-t border-gray-200 mt-8 py-3 ${className}`}
      aria-label="Alkalmazás verzió"
    >
      <div className="container mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <span className="font-medium text-gray-600">{getClientVersionLabel()}</span>
        <span>
          Csomag: {pkg.displayName}
          {isGinop && (
            <span className="ml-2 text-mbit-blue">GINOP pályázati változat</span>
          )}
        </span>
      </div>
    </footer>
  );
}
