
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, Image as ImageIcon, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  mainImage: string;
  galleryImages: string[];
  onMainImageChange: (imageUrl: string) => void;
  onGalleryImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUpload = ({ 
  mainImage, 
  galleryImages, 
  onMainImageChange, 
  onGalleryImagesChange, 
  maxImages = 5 
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File, isMainImage: boolean = false) => {
    try {
      setUploading(true);
      
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload le fichier vers Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      if (isMainImage) {
        onMainImageChange(publicUrl);
      } else {
        onGalleryImagesChange([...galleryImages, publicUrl]);
      }

      toast({
        title: "Succès",
        description: `Image ${isMainImage ? 'principale' : 'de galerie'} uploadée avec succès`
      });
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'uploader l'image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;
    uploadImage(file, true);
  };

  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    if (galleryImages.length >= maxImages) {
      toast({
        title: "Erreur",
        description: `Vous ne pouvez pas ajouter plus de ${maxImages} images à la galerie`,
        variant: "destructive"
      });
      return;
    }

    uploadImage(file, false);
  };

  const validateFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image",
        variant: "destructive"
      });
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5MB",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const removeMainImage = () => {
    onMainImageChange("");
  };

  const removeGalleryImage = (index: number) => {
    const newImages = galleryImages.filter((_, i) => i !== index);
    onGalleryImagesChange(newImages);
  };

  const setAsMainImage = (imageUrl: string, index: number) => {
    // Si il y a déjà une image principale, l'ajouter à la galerie
    if (mainImage) {
      onGalleryImagesChange([...galleryImages, mainImage]);
    }
    // Définir la nouvelle image principale
    onMainImageChange(imageUrl);
    // Retirer l'image de la galerie
    removeGalleryImage(index);
  };

  return (
    <div className="space-y-6">
      {/* Image principale */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Image principale *</Label>
          {!mainImage && (
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                disabled={uploading}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                className="flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Upload...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Ajouter l'image principale
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {mainImage ? (
          <div className="relative group w-48 h-48">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={mainImage}
                alt="Image principale"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={removeMainImage}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
            <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              Principale
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center w-48 h-48 flex flex-col justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">Aucune image principale</p>
          </div>
        )}
      </div>

      {/* Galerie d'images */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Galerie d'images</Label>
          {galleryImages.length < maxImages && (
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={handleGalleryImageChange}
                disabled={uploading}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                className="flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Upload...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Ajouter à la galerie
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`Galerie ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
                {!mainImage && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setAsMainImage(imageUrl, index)}
                    className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 text-xs px-2 py-1"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Principale
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune image dans la galerie</p>
            <p className="text-sm text-muted-foreground">
              Les images de galerie complètent l'image principale
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
