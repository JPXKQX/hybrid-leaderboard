import React from 'react';
import { Category } from '../types';
import { ChevronDown } from 'lucide-react';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory: (categoryId?: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  // Find the selected category name
  const selectedCategoryName = selectedCategory 
    ? categories.find(c => c.id === selectedCategory)?.label || 'Todas las categorías'
    : 'Todas las categorías';

  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (categoryId?: string) => {
    onSelectCategory(categoryId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full md:w-64 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-800">{selectedCategoryName}</span>
        <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <ul className="py-1">
            <li>
              <button
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${!selectedCategory ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-800'}`}
                onClick={() => handleSelect(undefined)}
              >
                Todas las categorías
              </button>
            </li>
            {categories.map(category => (
              <li key={category.id}>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${selectedCategory === category.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-800'}`}
                  onClick={() => handleSelect(category.id)}
                >
                  {category.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;