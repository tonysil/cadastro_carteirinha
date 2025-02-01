import { supabase } from "@/integrations/supabase/client";

export const usePhotoUpload = () => {
  const uploadPhoto = async (photo: File, userId: string, prefix: string = '') => {
    if (!photo) return null;
    
    const fileExt = photo.name.split('.').pop();
    const fileName = `${prefix}${userId}-${Math.random()}.${fileExt}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('photos')
      .upload(fileName, photo);

    if (uploadError) {
      console.error('Error uploading photo:', uploadError);
      return null;
    }

    return data?.path || null;
  };

  return { uploadPhoto };
};