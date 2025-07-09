import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentUser, login } from '@/stores/authStore';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { loginUser } from '@/services/auth.service';
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { User } from '@/interfaces/User';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void; // Nueva prop para manejar el clic en "Registrarse"
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const token = await loginUser(email, password);
      login(token);
      onClose();
    } catch (error: any) {
      console.error('Error durante el inicio de sesión:', error);
      if (error.response && error.response.status === 401) {
        setError('Credenciales inválidas. Por favor, intente de nuevo.');
      } else {
        setError('Ocurrió un error al iniciar sesión. Por favor, intente de nuevo más tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 py-6 sm:p-0">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-background/80 backdrop-blur-md p-6 sm:p-8 rounded-lg shadow-lg relative w-full max-w-md mx-auto">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2"
          onClick={onClose}
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
        </Button>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Iniciar sesión</h2>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <Input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Contraseña
            </label>
            <Input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="w-full"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-sm text-muted-foreground">¿No tienes una cuenta? </span>
          <Button 
            variant="link" 
            className="text-sm text-primary p-0 cursor-pointer" 
            onClick={() => {
              onClose();
              onRegisterClick();
            }}
          >
            Regístrate aquí
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;