import React, { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createUser } from '@/services/auth.service';
import { login } from '@/stores/authStore';
import { toast } from 'sonner';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const registerSchema = z.object({
  email: z.string().email('El email no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(1, 'El nombre es obligatorio'),
  lastname: z.string().min(1, 'El apellido es obligatorio'),
  username: z.string().min(1, 'El nombre de usuario es obligatorio'),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onLoginClick }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema)
  });

  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      setError(null);
      const payload = {
        email: data.email.toLowerCase(),
        password: data.password,
        name: data.name,
        lastname: data.lastname,
        username: data.username,
        apple_user: false,
        emailError: null,
        passwordError: null,
        role_id: 2
      }
      const token = await createUser(payload)
      login(token);
      toast('Registro exitoso.', {
        description: 'Te has registrado correctamente. !Bienvenido!',
        duration: 2000, // 3 segundos
        position: 'top-center',
      })
      onClose();
    } catch (error:any) {
      console.error('Error durante el registro:', error);
      if (error.response && error.response.status === 400) {
        setError('El email ya está registrado');
      } else {
        setError('Ocurrió un error durante el registro. Por favor, intente de nuevo.');
      }
    }
  };

  useEffect(() => {
    reset();
    setError(null);
  }, [isOpen, reset])

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
          disabled={isSubmitting}
        >
          <X className="h-4 w-4" />
        </Button>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Registrarse</h2>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <Input 
              type="email" 
              id="email" 
              {...register('email')}
              className={`w-full ${errors.email ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Contraseña
            </label>
            <Input 
              type="password" 
              id="password" 
              {...register('password')}
              className={`w-full ${errors.password ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
              Nombre
            </label>
            <Input 
              type="text" 
              id="name" 
              {...register('name')}
              className={`w-full ${errors.name ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          
          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-foreground mb-1">
              Apellido
            </label>
            <Input 
              type="text" 
              id="lastname" 
              {...register('lastname')}
              className={`w-full ${errors.lastname ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
            {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname.message}</p>}
          </div>
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">
              Nombre de usuario
            </label>
            <Input 
              type="text" 
              id="username" 
              {...register('username')}
              className={`w-full ${errors.username ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>
          
          <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              'Registrarse'
            )}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <span className="text-sm text-muted-foreground">¿Ya tienes una cuenta? </span>
          <Button 
            variant="link" 
            className="text-sm text-primary p-0 cursor-pointer" 
            onClick={() => {
              onClose();
              onLoginClick();
            }}
          >
            Inicia sesión aquí
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;