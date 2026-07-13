import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Panier from './pages/Panier';
import Paiement from './pages/Paiement';
import Confirmation from './pages/Confirmation';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/produit/:id" component={ProductDetail} />
      <Route path="/panier" component={Panier} />
      <Route path="/paiement" component={Paiement} />
      <Route path="/confirmation" component={Confirmation} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <div className="flex flex-col min-h-screen selection:bg-primary/20">
              <Navbar />
              <main className="flex-1">
                <Router />
              </main>
              <Footer />
            </div>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;