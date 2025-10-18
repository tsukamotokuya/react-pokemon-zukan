import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PokemonList from './pages/PokemonList';
import PokemonDetail from './pages/PokemonDetail';
import Header from './components/Header';
import Navigation from './components/Navigation';
import './App.css';

// QueryClientのインスタンスを作成
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<PokemonList />} />
              <Route path="/pokemon/:id" element={<PokemonDetail />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
