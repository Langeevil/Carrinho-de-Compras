import { API_KEY, API_URL } from '@/constants/api';
import { Product } from '@/types';

type JsonBinResponse =
  | {
      record?: {
        produtos?: Product[];
      };
    }
  | {
      produtos?: Product[];
    };

export async function fetchProducts(): Promise<Product[]> {
  if (!API_URL) {
    throw new Error('URL do jsonbin.io não configurada em constants/api.js');
  }

  const response = await fetch(API_URL, {
    headers: {
      'Content-Type': 'application/json',
      ...(API_KEY
        ? {
            // Enviamos nos dois headers para cobrir tanto Master Key quanto Access Key.
            'X-Master-Key': API_KEY,
            'X-Access-Key': API_KEY,
          }
        : {}),
    },
  });

  if (!response.ok) {
    throw new Error('Não foi possível buscar os produtos. Verifique a URL/chave do jsonbin.io.');
  }

  const data = (await response.json()) as JsonBinResponse;

  if ('record' in data && data.record?.produtos) {
    return data.record.produtos;
  }

  if ('produtos' in data && data.produtos) {
    return data.produtos;
  }

  throw new Error('Resposta da API em formato inesperado.');
}
