import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PokemonList from './pages/PokemonList';
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
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold text-center">ポケモン図鑑</h1>
        </header>
        <main>
          <PokemonList />
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
