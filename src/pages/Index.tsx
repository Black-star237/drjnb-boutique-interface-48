
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProductForm from "@/components/ProductForm";
import ProductList from "@/components/ProductList";
import CategoryManagement from "@/components/CategoryManagement";
import Dashboard from "@/components/Dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product, Category, SupabaseProduct } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Helper function to transform Supabase data to our Product type
  const transformSupabaseProduct = (supabaseProduct: SupabaseProduct): Product => {
    return {
      ...supabaseProduct,
      images: Array.isArray(supabaseProduct.images) ? supabaseProduct.images : null
    };
  };

  // Charger les catégories depuis Supabase
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive"
      });
    }
  };

  // Charger les produits depuis Supabase
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our Product interface
      const transformedProducts = (data || []).map(transformSupabaseProduct);
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les produits",
        variant: "destructive"
      });
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchProducts()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleAddProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;

      const transformedProduct = transformSupabaseProduct(data);
      setProducts(prev => [transformedProduct, ...prev]);
      toast({
        title: "Succès",
        description: "Le produit a été ajouté avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit",
        variant: "destructive"
      });
    }
  };

  const handleAddCategory = async (categoryData: Omit<Category, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => [...prev, data]);
      toast({
        title: "Succès",
        description: "La catégorie a été ajoutée avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la catégorie",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== productId));
      toast({
        title: "Succès",
        description: "Le produit a été supprimé"
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      setCategories(prev => prev.filter(c => c.id !== categoryId));
      // Mettre à jour les produits qui avaient cette catégorie
      setProducts(prev => prev.map(p => 
        p.category_id === categoryId ? { ...p, category_id: null } : p
      ));
      toast({
        title: "Succès",
        description: "La catégorie a été supprimée"
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
              <TabsTrigger value="products">Produits</TabsTrigger>
              <TabsTrigger value="add-product">Ajouter un produit</TabsTrigger>
              <TabsTrigger value="categories">Catégories</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="animate-scale-in">
              <Dashboard products={products} categories={categories} />
            </TabsContent>

            <TabsContent value="products" className="animate-scale-in">
              <ProductList 
                products={products} 
                categories={categories}
                onDeleteProduct={handleDeleteProduct}
              />
            </TabsContent>

            <TabsContent value="add-product" className="animate-scale-in">
              <ProductForm 
                categories={categories}
                onSubmit={handleAddProduct}
              />
            </TabsContent>

            <TabsContent value="categories" className="animate-scale-in">
              <CategoryManagement 
                categories={categories}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
