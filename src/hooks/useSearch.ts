import { useQuery } from '@tanstack/react-query';
import api, { SearchParams, AutocompleteSuggestion } from '../services/api';

export const useProductSearch = (params: SearchParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => api.searchProducts(params),
    gcTime: 1000 * 60 * 5, // 5 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAutocomplete = (query: string) => {
  return useQuery<AutocompleteSuggestion[], Error>({
    queryKey: ['autocomplete', query],
    queryFn: () => api.getAutocompleteSuggestions(query),
    enabled: query.length >= 2, // Only fetch if query is at least 2 characters
    gcTime: 1000 * 60 * 5, // 5 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProductDetails = (id: number | null) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProductById(id!),
    enabled: id !== null,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
