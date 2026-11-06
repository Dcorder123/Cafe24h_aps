import React, { useState } from 'react';

const categoryLabels = {
  coffee: 'Café',
  tea: 'Chá',
  snacks: 'Salgado',
  sweets: 'Doce',
  drinks: 'Bebida'
};

const ProductCard = ({ product, onAddToCart, isOutOfStock = false, isAdmin = false, onDeleteProduct, darkMode = false }) => {
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    if (!isOutOfStock && onAddToCart) {
      onAddToCart(product);
    }
  };

  const formatPrice = (price) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
      darkMode ? 'bg-gray-800 border border-gray-700 text-gray-100' : 'bg-white text-gray-800'
    }`}>
      {/* Imagem do Produto */}
      <div className="relative h-48 bg-gradient-to-br from-amber-100 to-amber-200 overflow-hidden">
        {!imageError ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200">
            <span className="text-6xl opacity-50">🍽️</span>
          </div>
        )}

        {/* Badge de Categoria */}
        {(product.categoryLabel || categoryLabels[product.category]) && (
          <div className="absolute top-3 left-3">
            <span className="bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-amber-700 shadow-md">
              {product.categoryLabel || categoryLabels[product.category]}
            </span>
          </div>
        )}

        {/* Badge de Esgotado */}
        {isOutOfStock && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
              Esgotado
            </span>
          </div>
        )}

        {/* Badge de Promoção */}
        {product.isPromotion && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md flex items-center">
              🔥 Promoção
            </span>
          </div>
        )}
      </div>

      {/* Informações do Produto */}
      <div className="p-6">
        {/* Nome e Descrição */}
        <h3 className={`text-xl font-bold mb-2 line-clamp-1 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          {product.name}
        </h3>
        
        <p className={`text-sm mb-4 line-clamp-2 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {product.description}
        </p>

        {/* Preço e Botão */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-amber-500">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 active:scale-95'
            }`}
          >
            {isOutOfStock ? (
              <span className="flex items-center">
                ❌ <span className="ml-1">Indisponível</span>
              </span>
            ) : (
              <span className="flex items-center">
                🛒 <span className="ml-1">Adicionar</span>
              </span>
            )}
          </button>
        </div>

        {/* Ação de Administrador */}
        {isAdmin && onDeleteProduct && (
          <button
            onClick={() => {
              if (window.confirm(`Remover "${product.name}" do cardápio?`)) {
                onDeleteProduct(product.id);
              }
            }}
            className="w-full mt-4 py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/40 dark:hover:bg-red-900/60 dark:text-red-300 text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-1 border border-red-200 dark:border-red-800"
          >
            🗑️ Remover Produto (Admin)
          </button>
        )}

        {/* Informações Adicionais */}
        {product.preparationTime && (
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <span className="mr-1">⏱️</span>
            <span>Preparo: {product.preparationTime} min</span>
          </div>
        )}

        {product.calories && (
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span className="mr-1">🔥</span>
            <span>{product.calories} kcal</span>
          </div>
        )}

        {/* Tags do Produto */}
        {product.tags && product.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{product.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
