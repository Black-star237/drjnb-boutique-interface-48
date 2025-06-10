
import { useState } from "react";
import Header from "@/components/Header";
import ProductForm from "@/components/ProductForm";
import ProductList from "@/components/ProductList";
import CategoryManagement from "@/components/CategoryManagement";
import Dashboard from "@/components/Dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product, Category } from "@/types";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Compléments alimentaires", description: "Vitamines et suppléments naturels", created_at: new Date().toISOString() },
    { id: "2", name: "Soins naturels", description: "Produits de soin à base d'ingrédients naturels", created_at: new Date().toISOString() },
    { id: "3", name: "Huiles essentielles", description: "Huiles essentielles pures et biologiques", created_at: new Date().toISOString() }
  ]);

  const handleAddProduct = (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const handleAddCategory = (categoryData: Omit<Category, 'id' | 'created_at'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    // Also update products that had this category
    setProducts(prev => prev.map(p => 
      p.category_id === categoryId ? { ...p, category_id: null } : p
    ));
  };

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
