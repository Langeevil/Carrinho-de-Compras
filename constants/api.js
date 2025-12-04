/**
 * Configuração da API do jsonbin.io em JavaScript.
 * Preencha no .env:
 *  - EXPO_PUBLIC_JSONBIN_URL=https://api.jsonbin.io/v3/b/SEU_BIN_ID/latest
 *  - EXPO_PUBLIC_JSONBIN_KEY=<X-Master-Key ou X-Access-Key se for privado>
 */
export const API_URL = process.env.EXPO_PUBLIC_JSONBIN_URL;
export const API_KEY = process.env.EXPO_PUBLIC_JSONBIN_KEY;
