import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ProductService } from '../../services/ProductService';

const ProductList = ({ selectedCategory, searchTerm, onAddToCart, isAdmin = false, onDeleteProduct, darkMode = false }) => {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [productVersion, setProductVersion] = useState(0);

  // Escutar adições e remoções de produtos do ProductService
  useEffect(() => {
    const unsub = ProductService.getInstance().subscribe(() => {
      setProductVersion(v => v + 1);
    });
    return unsub;
  }, []);

  // Filtrar e ordenar produtos
  const filteredAndSortedProducts = useMemo(() => {
    const productService = ProductService.getInstance();
    let products = productService.getProductsByCategory(selectedCategory);

    // Aplicar busca respeitando a categoria ativa
    if (searchTerm) {
      products = productService.searchProducts(searchTerm);
      if (selectedCategory && selectedCategory !== 'all') {
        products = products.filter(p => p.category === selectedCategory);
      }
    }

    // Copiar array para evitar mutação in-place do estado do serviço
    const sorted = [...products].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchTerm, sortBy, sortOrder, productVersion]);

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↗️' : '↘️';
  };

  if (filteredAndSortedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h3>
        <p className="text-center max-w-md">
          {searchTerm
            ? `Não encontramos produtos que correspondam à busca "${searchTerm}"`
            : 'Não há produtos disponíveis nesta categoria no momento'
          }
        </p>
        {searchTerm && (
          <div className="mt-4 text-sm text-gray-400">
            <p>Dicas para melhorar sua busca:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Verifique a ortografia</li>
              <li>Use termos mais genéricos</li>
              <li>Experimente categorias diferentes</li>
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Header com informações e filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {searchTerm ? `Resultados para "${searchTerm}"` : 'Nosso Cardápio'}
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredAndSortedProducts.length} produto{filteredAndSortedProducts.length !== 1 ? 's' : ''} encontrado{filteredAndSortedProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Controles de ordenação */}
        <div className={`flex items-center gap-2 rounded-xl shadow-md p-2 ${
          darkMode ? 'bg-gray-800 border border-gray-700 text-gray-200' : 'bg-white text-gray-700'
        }`}>
          <span className="text-sm mr-2 opacity-80">Ordenar:</span>
          
          <button
            onClick={() => handleSortChange('name')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              sortBy === 'name'
                ? 'bg-amber-500 text-white shadow-sm'
                : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            Nome {getSortIcon('name')}
          </button>

          <button
            onClick={() => handleSortChange('price')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              sortBy === 'price'
                ? 'bg-amber-500 text-white shadow-sm'
                : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            Preço {getSortIcon('price')}
          </button>

          <button
            onClick={() => handleSortChange('category')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              sortBy === 'category'
                ? 'bg-amber-500 text-white shadow-sm'
                : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            Categoria {getSortIcon('category')}
          </button>
        </div>
      </div>

      {/* Grid de produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            isOutOfStock={product.stock === 0}
            isAdmin={isAdmin}
            onDeleteProduct={onDeleteProduct}
            darkMode={darkMode}
          />
        ))}
      </div>

      {/* Estatísticas da busca */}
      {searchTerm && (
        <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <h4 className="font-semibold text-amber-800 mb-2">📊 Estatísticas da busca</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-amber-700">{filteredAndSortedProducts.length}</div>
              <div className="text-amber-600">Produtos</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-amber-700">
                {new Set(filteredAndSortedProducts.map(p => p.category)).size}
              </div>
              <div className="text-amber-600">Categorias</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-amber-700">
                R$ {Math.min(...filteredAndSortedProducts.map(p => p.price)).toFixed(2)}
              </div>
              <div className="text-amber-600">Menor preço</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-amber-700">
                R$ {Math.max(...filteredAndSortedProducts.map(p => p.price)).toFixed(2)}
              </div>
              <div className="text-amber-600">Maior preço</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
