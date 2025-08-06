import { CATEGORIES } from '../utils/constants';

export class ProductService {
  static instance = null;

  constructor() {
    if (ProductService.instance) {
      return ProductService.instance;
    }
    
    this.products = this.generatePlaceholderProducts();
    ProductService.instance = this;
  }

  static getInstance() {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  generatePlaceholderProducts() {
    return [
      // Cafés
      {
        id: 'prod001',
        name: 'Café Expresso Clássico',
        description: 'Um expresso forte e aromático, perfeito para começar o dia.',
        price: 8.50,
        category: CATEGORIES.COFFEE,
        imageUrl: '/images/cafes/expresso.jpg'
      },
      {
        id: 'prod002',
        name: 'Latte Cremoso',
        description: 'Café, leite vaporizado e uma generosa camada de espuma de leite.',
        price: 12.00,
        category: CATEGORIES.COFFEE,
        imageUrl: '/images/cafes/latte.jpg'
      },
      {
        id: 'prod012',
        name: 'Cappuccino Especial',
        description: 'Café expresso com leite vaporizado e espuma, polvilhado com canela.',
        price: 11.50,
        category: CATEGORIES.COFFEE,
        imageUrl: '/images/cafes/cappuccino.jpeg'
      },
      {
        id: 'prod013',
        name: 'Café Americano',
        description: 'Expresso diluído em água quente, sabor suave e encorpado.',
        price: 7.00,
        category: CATEGORIES.COFFEE,
        imageUrl: '/images/cafes/americano.jpg'
      },
      
      // Chás
      {
        id: 'prod003',
        name: 'Chá Verde Matcha',
        description: 'Chá verde japonês moído, com sabor único e antioxidantes.',
        price: 15.00,
        category: CATEGORIES.TEA,
        imageUrl: '/images/chas/Chá_Verde_Matcha.jpeg'
      },
      {
        id: 'prod014',
        name: 'Chá de Camomila',
        description: 'Chá relaxante e aromático, perfeito para momentos de tranquilidade.',
        price: 9.00,
        category: CATEGORIES.TEA,
        imageUrl: '/images/chas/chá_camomila.jpeg'
      },
      {
        id: 'prod015',
        name: 'Chá Preto Earl Grey',
        description: 'Chá preto aromatizado com bergamota, clássico e refinado.',
        price: 10.50,
        category: CATEGORIES.TEA,
        imageUrl: '/images/chas/cha-preto-premium.jpeg'
      },
      {
        id: 'prod026',
        name: 'Chá Preto Premium',
        description: 'Chá preto especial servido em bule de vidro, acompanha biscoitos.',
        price: 14.00,
        category: CATEGORIES.TEA,
        imageUrl: '/images/chas/cha-preto-premium.jpeg'
      },
      
      // Salgados
      {
        id: 'prod004',
        name: 'Pão de Queijo Clássico',
        description: 'O tradicional pão de queijo mineiro, crocante por fora e macio por dentro.',
        price: 7.00,
        category: CATEGORIES.SNACKS,
        imageUrl: '/images/salgados/pao-de-queijo.jpeg'
      },
      {
        id: 'prod016',
        name: 'Coxinha de Frango',
        description: 'Salgado brasileiro clássico com recheio de frango desfiado.',
        price: 8.50,
        category: CATEGORIES.SNACKS,
        imageUrl: '/images/salgados/coxinha.jpeg'
      },
      {
        id: 'prod017',
        name: 'Pastel de Queijo',
        description: 'Pastel crocante recheado com queijo derretido.',
        price: 6.50,
        category: CATEGORIES.SNACKS,
        imageUrl: '/images/salgados/Pastel_de_Queijo.jpeg'
      },
      {
        id: 'prod018',
        name: 'Sanduíche Natural',
        description: 'Sanduíche com ingredientes frescos e saudáveis.',
        price: 12.00,
        category: CATEGORIES.SNACKS,
        imageUrl: '/images/salgados/Sanduíche_Natural.jpeg'
      },
      {
        id: 'prod027',
        name: 'Coxinha Premium',
        description: 'Coxinha artesanal dourada com recheio cremoso de frango.',
        price: 9.50,
        category: CATEGORIES.SNACKS,
        imageUrl: '/images/salgados/coxinha.jpeg'
      },
      
      // Doces
      {
        id: 'prod005',
        name: 'Bolo de Cenoura',
        description: 'Fatia generosa de bolo de cenoura com cobertura de chocolate cremoso.',
        price: 18.00,
        category: CATEGORIES.SWEETS,
        imageUrl: '/images/doces/Bolo_de_Cenoura.webp'
      },
      {
        id: 'prod019',
        name: 'Brigadeiro Gourmet',
        description: 'Doce brasileiro tradicional com chocolate belga premium.',
        price: 4.50,
        category: CATEGORIES.SWEETS,
        imageUrl: '/images/doces/Brigadeiro_Gourmet.webp'
      },
      {
        id: 'prod020',
        name: 'Cheesecake de Frutas',
        description: 'Cheesecake cremoso com calda de frutas vermelhas.',
        price: 22.00,
        category: CATEGORIES.SWEETS,
        imageUrl: '/images/doces/cheesecake.jpg'
      },
      {
        id: 'prod021',
        name: 'Pudim de Leite',
        description: 'Pudim caseiro cremoso com calda de caramelo.',
        price: 15.00,
        category: CATEGORIES.SWEETS,
        imageUrl: '/images/doces/pudim.jpg'
      },
      
      // Bebidas
      {
        id: 'prod006',
        name: 'Suco Natural de Laranja',
        description: 'Suco 100% natural, fresco e gelado, feito com laranjas selecionadas.',
        price: 10.00,
        category: CATEGORIES.DRINKS,
        imageUrl: '/images/bebidas/Suco Natural de Laranja.jpeg'
      },
      {
        id: 'prod022',
        name: 'Smoothie de Açaí',
        description: 'Smoothie cremoso de açaí com granola e banana.',
        price: 16.00,
        category: CATEGORIES.DRINKS,
        imageUrl: '/images/bebidas/Smoothie_de_Açaí.jpeg'
      },
      {
        id: 'prod023',
        name: 'Água de Coco Gelada',
        description: 'Água de coco natural e refrescante, direto do coco.',
        price: 8.00,
        category: CATEGORIES.DRINKS,
        imageUrl: '/images/bebidas/agua-coco-natural.jpeg'
      },
      {
        id: 'prod024',
        name: 'Refrigerante Natural',
        description: 'Refrigerante artesanal sem conservantes, sabores variados.',
        price: 7.50,
        category: CATEGORIES.DRINKS,
        imageUrl: '/images/bebidas/agua-saborizada.jpg'
      },
      {
        id: 'prod029',
        name: 'Água Saborizada',
        description: 'Água refrescante com frutas naturais e hortelã.',
        price: 6.50,
        category: CATEGORIES.DRINKS,
        imageUrl: '/images/bebidas/agua-saborizada.jpg'
      },
      {
        id: 'prod030',
        name: 'Água de Coco Natural',
        description: 'Água de coco fresca direto do coco verde.',
        price: 9.00,
        category: CATEGORIES.DRINKS,
        imageUrl: '/images/bebidas/agua-coco-natural.jpeg'
      }
    ];
  }

  getAllProducts() {
    return this.products;
  }

  getProductsByCategory(category) {
    if (category === CATEGORIES.ALL) {
      return this.products;
    }
    return this.products.filter(product => product.category === category);
  }

  getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }
}

export default ProductService;
