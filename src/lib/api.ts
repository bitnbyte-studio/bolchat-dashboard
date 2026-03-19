/**
 * BolChat API Client utility
 * This is a placeholder structure for actual backend fetch calls.
 */
export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${token}`
  };

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
