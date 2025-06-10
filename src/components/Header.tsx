
import { Stethoscope, Leaf } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Stethoscope className="h-8 w-8 text-primary" />
                <Leaf className="h-4 w-4 text-accent absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">Dr. JNB</h1>
                <p className="text-sm text-muted-foreground">Nature & Santé</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Interface de gestion</p>
              <p className="text-xs text-muted-foreground">Boutique e-commerce</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
