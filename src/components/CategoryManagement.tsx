
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Tag } from "lucide-react";
import { Category } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface CategoryManagementProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id' | 'created_at'>) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const CategoryManagement = ({ categories, onAddCategory, onDeleteCategory }: CategoryManagementProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie est obligatoire",
        variant: "destructive"
      });
      return;
    }

    onAddCategory({
      name: formData.name.trim(),
      description: formData.description.trim() || null
    });

    setFormData({ name: "", description: "" });
    
    toast({
      title: "Succès",
      description: "La catégorie a été ajoutée avec succès"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestion des catégories</h2>
        <p className="text-muted-foreground">
          Organisez vos produits par catégories
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire d'ajout */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Ajouter une catégorie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Nom de la catégorie *</Label>
                <Input
                  id="category-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Compléments alimentaires"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-description">Description</Label>
                <Textarea
                  id="category-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de la catégorie..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Ajouter la catégorie
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Liste des catégories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Catégories existantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="p-4 bg-gray-50 rounded-lg animate-scale-in">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Créée le {new Date(category.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {categories.length === 0 && (
                <div className="text-center py-8">
                  <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Aucune catégorie créée pour le moment
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoryManagement;
