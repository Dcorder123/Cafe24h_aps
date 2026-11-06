import { CartService } from './services/CartService';
import { ProductService } from './services/ProductService';
import { CustomerService } from './services/CustomerService';
import { formatPhone, onlyNumbers, onlyDecimals } from './utils/formatters';
import { CATEGORIES } from './utils/constants';

describe('Serviços Core e Formatação - Café 24h', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('CartService adiciona itens, calcula totais e persiste no localStorage', () => {
    const cart = new CartService();
    cart.clear();

    const produtoTeste = {
      id: 'teste_01',
      name: 'Café Teste',
      price: 10.0,
      imageUrl: '/images/test.jpg'
    };

    cart.addItem(produtoTeste);
    cart.addItem(produtoTeste);

    expect(cart.getTotalItems()).toBe(2);
    expect(cart.getTotalValue()).toBe(20.0);
    expect(cart.isEmpty()).toBe(false);

    // Testar persistência
    const salvoNoStorage = JSON.parse(localStorage.getItem('cafe24h_cart'));
    expect(salvoNoStorage).toHaveLength(1);
    expect(salvoNoStorage[0].quantity).toBe(2);

    // Limpar
    cart.clear();
    expect(cart.isEmpty()).toBe(true);
  });

  test('ProductService permite cadastrar e remover produtos customizados', () => {
    const productService = ProductService.getInstance();
    const totalInicial = productService.getAllProducts().length;

    const novoProduto = productService.addProduct({
      name: 'Novo Bolo de Laranja',
      description: 'Caseiro',
      price: 15.0,
      category: CATEGORIES.SWEETS
    });

    expect(novoProduto.id).toBeDefined();
    expect(productService.getAllProducts().length).toBe(totalInicial + 1);

    // Testar remoção
    productService.deleteProduct(novoProduto.id);
    expect(productService.getAllProducts().length).toBe(totalInicial);
  });

  test('Formatadores numéricos e de telefone celular', () => {
    // formatPhone
    expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
    expect(formatPhone('1187654321')).toBe('(11) 8765-4321');
    expect(formatPhone('abc11xyz999998888')).toBe('(11) 99999-8888');

    // onlyNumbers
    expect(onlyNumbers('Rua 123, apto 4B', 4)).toBe('1234');
    expect(onlyNumbers('letras e números 987')).toBe('987');

    // onlyDecimals
    expect(onlyDecimals('14.50abc')).toBe('14.50');
    expect(onlyDecimals('12.34.56')).toBe('12.3456');
    expect(onlyDecimals('abc')).toBe('');
  });

  test('CustomerService cadastra cliente por celular e faz login automático', () => {
    const novoCliente = {
      name: 'Maria Oliveira',
      phone: '(11) 98888-7777',
      email: 'maria@email.com',
      address: 'Av Paulista',
      number: '1000'
    };

    // Salvar cliente
    CustomerService.saveUser(novoCliente);

    // Buscar por telefone com ou sem máscara
    const encontrado = CustomerService.findByPhone('11988887777');
    expect(encontrado).not.toBeNull();
    expect(encontrado.name).toBe('Maria Oliveira');
    expect(encontrado.number).toBe('1000');

    // Simular logout / nova sessão
    CustomerService.logout();
    expect(CustomerService.getCurrentUser().isAnonymous).toBe(true);

    // Login com telefone carrega automaticamente
    const loginSucesso = CustomerService.loginWithPhone('(11) 98888-7777');
    expect(loginSucesso).not.toBeNull();
    expect(loginSucesso.name).toBe('Maria Oliveira');

    // Usuário corrente ativo
    expect(CustomerService.getCurrentUser().name).toBe('Maria Oliveira');
  });
});
