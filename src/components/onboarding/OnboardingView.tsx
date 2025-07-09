import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { isAuthenticated, isInOnboarding, getCurrentUser, currentUser as userStore, login } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getAllCareers } from '@/services/career.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import type { Career } from '@/interfaces/Career';
import { revalidateToken, updateUser } from '@/services/auth.service';

// Función para comprimir y convertir la imagen a base64
const compressAndConvertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

const onboardingSchema = z.object({
  career_id: z.string().refine((val) => val !== '0', {
    message: "Debes seleccionar una carrera",
  }),
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  profile_image: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof onboardingSchema>;

const OnboardingView: React.FC = () => {
  const $isAuthenticated = useStore(isAuthenticated);
  const $isInOnboarding = useStore(isInOnboarding);
  const [careers, setCareers] = useState<Career[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const currentUser = getCurrentUser();

  const { control, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      username: currentUser?.username || '',
      career_id: currentUser?.career_id ? currentUser.career_id.toString() : '0',
    }
  });

  const watchProfileImage = watch("profile_image");

  useEffect(() => {
    if (watchProfileImage instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(watchProfileImage);
    } else {
      setImagePreview(null);
    }
  }, [watchProfileImage]);

  const fetchCareers = async () => {
    try {
      const data = await getAllCareers();
      setCareers(data);
    } catch (error) {
      console.error('Error fetching careers', error);
      toast.error('Error al cargar las carreras', {
        description: 'Por favor, intenta de nuevo más tarde.',
      });
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  useEffect(() => {
    if (!$isAuthenticated) {
      window.location.href = '/';
    }
  }, [$isAuthenticated, $isInOnboarding]);

  const onSubmit = async (data: FormData) => {
    try {
      if (!currentUser) throw new Error('No user found');

      const formData = new FormData();
      formData.append('career_id', data.career_id);
      formData.append('username', data.username);

      if (data.profile_image instanceof File) {
        const compressedImage = await compressAndConvertToBase64(data.profile_image);
        formData.append('image', compressedImage);
      }

      await updateUser(currentUser.id, formData);
      const newToken = await revalidateToken()
      isInOnboarding.set(false);
      login(newToken);

      toast.success('Perfil actualizado', {
        description: 'Tu información ha sido actualizada exitosamente.',
        duration: 2000,
        position: 'top-center',
      });
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Error updating user', error);
      toast.error('Error al actualizar el perfil', {
        description: 'Por favor, intenta de nuevo más tarde.',
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  if (!$isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Completa tu perfil</h2>
        <p className="mb-6 text-muted-foreground">
          Para personalizar tu experiencia, por favor completa la siguiente informaci&oacute;n.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">Email</label>
            <Input 
              type="email" 
              id="email" 
              value={currentUser?.email || ''} 
              disabled 
              className="w-full bg-muted"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-muted-foreground">Nombre de usuario</label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input {...field} className="w-full" />
              )}
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="profile_image" className="block text-sm font-medium text-muted-foreground">Imagen de perfil</label>
            <Controller
              name="profile_image"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <>
                  <Input 
                    type="file" 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                      }
                    }}
                    accept="image/*"
                    className="w-full"
                    {...field}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-full" />
                    </div>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="career_id" className="block text-sm font-medium text-muted-foreground">Carrera</label>
            <Controller
              name="career_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona tu carrera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Elige una carrera</SelectItem>
                    {careers.map((career) => (
                      <SelectItem key={career.id} value={career.id.toString()}>
                        {career.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.career_id && <p className="text-sm text-red-500">{errors.career_id.message}</p>}
          </div>

          <Button type="submit" className="w-full">
            Guardar y continuar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingView;