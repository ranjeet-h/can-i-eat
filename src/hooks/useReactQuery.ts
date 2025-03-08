import {
  useQuery,
  useMutation,
  QueryKey,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { get, post, put, patch, del } from '../services/api';

// Type for the error response
export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}

// Typed query hook that accepts a URL and options
export function useApiQuery<TData>(
  queryKey: QueryKey,
  url: string,
  options?: Omit<UseQueryOptions<TData, AxiosError<ApiError>, TData>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, AxiosError<ApiError>>({
    queryKey,
    queryFn: async () => get<TData>(url),
    ...options,
  });
}

// Post mutation with optimistic updates
export function useApiPost<TData, TVariables = Record<string, unknown>>(
  url: string,
  options?: Omit<UseMutationOptions<TData, AxiosError<ApiError>, TVariables>, 'mutationFn'>
) {
  // We'll keep queryClient for potential future use but comment it out to avoid linter errors
  // const queryClient = useQueryClient();

  return useMutation<TData, AxiosError<ApiError>, TVariables>({
    mutationFn: variables => post<TData, TVariables>(url, variables),
    ...options,
    onSuccess: (data, variables, context) => {
      // Call the original onSuccess if it exists
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }

      // Invalidate relevant queries if needed
      if (options?.onSettled) {
        options.onSettled(data, null, variables, context);
      }
    },
    onError: (error, variables, context) => {
      // Call the original onError if it exists
      if (options?.onError) {
        options.onError(error, variables, context);
      }

      // Display error toast or notification
      console.error('API Error:', error.response?.data?.message || error.message);

      // Call onSettled callback if it exists
      if (options?.onSettled) {
        options.onSettled(undefined, error, variables, context);
      }
    },
  });
}

// Put mutation
export function useApiPut<TData, TVariables = Record<string, unknown>>(
  url: string,
  options?: Omit<UseMutationOptions<TData, AxiosError<ApiError>, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, AxiosError<ApiError>, TVariables>({
    mutationFn: variables => put<TData, TVariables>(url, variables),
    ...options,
  });
}

// Patch mutation
export function useApiPatch<TData, TVariables = Record<string, unknown>>(
  url: string,
  options?: Omit<UseMutationOptions<TData, AxiosError<ApiError>, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, AxiosError<ApiError>, TVariables>({
    mutationFn: variables => patch<TData, TVariables>(url, variables),
    ...options,
  });
}

// Delete mutation
export function useApiDelete<TData>(
  url: string,
  options?: Omit<UseMutationOptions<TData, AxiosError<ApiError>, void>, 'mutationFn'>
) {
  return useMutation<TData, AxiosError<ApiError>, void>({
    mutationFn: () => del<TData>(url),
    ...options,
  });
}
