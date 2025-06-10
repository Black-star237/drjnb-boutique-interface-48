
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Tag, TrendingUp, Eye } from "lucide-react";
import { Product, Category } from "@/types";

interface DashboardProps {
  products: Product[];
  categories: Category[];
}

const Dashboard = ({ products, categories }: DashboardProps) => {
  const activeProducts = products.filter(p => p.is_active);
  const totalRevenue = products.reduce((sum, product) => sum + product.price, 0);
  const averagePrice = products.length > 0 ? totalRevenue / products.length : 0;

  const stats = [
    {
      title: "Total Produits",
      value: products.length,
      icon: Package,
      color: "text-primary"
    },
    {
      title: "Produits Actifs",
      value: activeProducts.length,
      icon: Eye,
      color: "text-green-600"
    },
    {
      title: "Catégories",
      value: categories.length,
      icon: Tag,
      color: "text-accent"
    },
    {
      title: "Prix Moyen",
      value: `${averagePrice.toFixed(2)}€`,
      icon: TrendingUp,
      color: "text-blue-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h2>
        <p className="text-muted-foreground">
          Vue d'ensemble de votre boutique Dr. JNB Nature & Santé
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Produits Récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.slice(-5).reverse().map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.price}€</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    product.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.is_active ? 'Actif' : 'Inactif'}
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  Aucun produit ajouté pour le moment
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par Catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories.map((category) => {
                const categoryProducts = products.filter(p => p.category_id === category.id);
                return (
                  <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{categoryProducts.length}</p>
                      <p className="text-xs text-muted-foreground">produits</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
