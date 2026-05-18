import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const supabaseQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function SupabaseQueryProvider({ children }) {
  return (
    <QueryClientProvider client={supabaseQueryClient}>
      {children}
    </QueryClientProvider>
  );
}
