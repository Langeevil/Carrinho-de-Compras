export type Product = {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
};

export type CartItem = Product & {
  quantidade: number;
};
