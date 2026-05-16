export type Product = {
  id: string;
  category: string;
  name: string;
  price: number;
};

export const products: Product[] = [
  { id: 'c-gg', category: 'Camisetas e Babylooks', name: 'Camiseta até GG', price: 42.0 },
  { id: 'c-xg', category: 'Camisetas e Babylooks', name: 'Camiseta XG ou EXG', price: 56.0 },
  { id: 'b-xg', category: 'Camisetas e Babylooks', name: 'Babylook até XG', price: 42.0 },
  { id: 'b-exg', category: 'Camisetas e Babylooks', name: 'Babylook EXG', price: 56.0 },
  { id: 'ci-12', category: 'Camisetas e Babylooks', name: 'Camiseta infantil até Nº12', price: 38.0 },
  { id: 'ci-16', category: 'Camisetas e Babylooks', name: 'Camiseta infantil Nº14 ou Nº16', price: 42.0 },

  { id: 'mc-masc-gg', category: 'Moletons Canguru', name: 'Masculino até GG', price: 116.5 },
  { id: 'mc-masc-xg', category: 'Moletons Canguru', name: 'Masculino XG ou EXG', price: 136.5 },
  { id: 'mc-fem-xg', category: 'Moletons Canguru', name: 'Feminino até XG', price: 116.5 },
  { id: 'mc-fem-exg', category: 'Moletons Canguru', name: 'Feminino EXG', price: 136.5 },
  { id: 'mc-inf-12', category: 'Moletons Canguru', name: 'Infantil até Nº12', price: 112.0 },
  { id: 'mc-inf-16', category: 'Moletons Canguru', name: 'Infantil Nº14 ou Nº16', price: 116.5 },

  { id: 'jm-masc-gg', category: 'Jaquetas Moletom com Gola', name: 'Masculino até GG', price: 130.0 },
  { id: 'jm-masc-xg', category: 'Jaquetas Moletom com Gola', name: 'Masculino XG ou EXG', price: 150.0 },
  { id: 'jm-fem-xg', category: 'Jaquetas Moletom com Gola', name: 'Feminino até XG', price: 130.0 },
  { id: 'jm-fem-exg', category: 'Jaquetas Moletom com Gola', name: 'Feminino EXG', price: 150.0 },
  { id: 'jm-inf-12', category: 'Jaquetas Moletom com Gola', name: 'Infantil até Nº12', price: 128.0 },
  { id: 'jm-inf-16', category: 'Jaquetas Moletom com Gola', name: 'Infantil Nº14 ou Nº16', price: 130.0 },

  { id: 'jc-masc-gg', category: 'Jaquetas Corta Vento com Capuz', name: 'Masculino até GG', price: 133.0 },
  { id: 'jc-masc-xg', category: 'Jaquetas Corta Vento com Capuz', name: 'Masculino XG ou EXG', price: 153.0 },
  { id: 'jc-fem-xg', category: 'Jaquetas Corta Vento com Capuz', name: 'Feminino até XG', price: 133.0 },
  { id: 'jc-fem-exg', category: 'Jaquetas Corta Vento com Capuz', name: 'Feminino EXG', price: 153.0 },
  { id: 'jc-inf-12', category: 'Jaquetas Corta Vento com Capuz', name: 'Infantil até Nº12', price: 129.0 },
  { id: 'jc-inf-16', category: 'Jaquetas Corta Vento com Capuz', name: 'Infantil Nº14 ou Nº16', price: 133.0 },
];
