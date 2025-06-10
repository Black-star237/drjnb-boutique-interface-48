import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Edit, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { Product, Category } from "@/types";
import ProductEditModal from "./ProductEditModal";

interface ProductListProps {
  products: Product[];
  categories: Category[];
  onDeleteProduct: (productId: string) => void;
  onUpdateProduct: (productId: string, productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => void;
}

const ProductList = ({ products, categories, onDeleteProduct, onUpdateProduct }: ProductListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [imageIndices, setImageIndices] = useState<{[key: string]: number}>({});
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "Sans catégorie";
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Catégorie inconnue";
  };

  const getCurrentImageUrl = (product: Product) => {
    if (!product.images || product.images.length === 0) {
      return product.image_url;
    }
    const currentIndex = imageIndices[product.id] || 0;
    return product.images[currentIndex];
  };

  const nextImage = (productId: string, totalImages: number) => {
    setImageIndices(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (productId: string, totalImages: number) => {
    setImageIndices(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingProduct) {
      onUpdateProduct(editingProduct.id, productData);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestion des produits</h2>
        <p className="text-muted-foreground">
          Gérez tous vos produits Dr. JNB Nature & Santé
        </p>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const hasMultipleImages = product.images && product.images.length > 1;
          const currentImageUrl = getCurrentImageUrl(product);
          const currentIndex = imageIndices[product.id] || 0;
          const totalImages = product.images?.length || 0;

          return (
            <Card key={product.id} className="animate-scale-in hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getCategoryName(product.category_id)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    {product.is_active ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {currentImageUrl && (
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={currentImageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    
                    {/* Navigation des images */}
                    {hasMultipleImages && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => prevImage(product.id, totalImages)}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => nextImage(product.id, totalImages)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        
                        {/* Indicateur d'images */}
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          {currentIndex + 1}/{totalImages}
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {product.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary">
                    {product.price.toLocaleString()} FCFA
                  </div>
                  <Badge variant={product.is_active ? "default" : "secondary"}>
                    {product.is_active ? "Actif" : "Inactif"}
                  </Badge>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">
              {products.length === 0 
                ? "Aucun produit ajouté pour le moment" 
                : "Aucun produit ne correspond à vos critères de recherche"
              }
            </p>
          </CardContent>
        </Card>
      )}

      <ProductEditModal
        product={editingProduct}
        categories={categories}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default ProductList;
