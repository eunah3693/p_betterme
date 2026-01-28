import React from 'react';
import Button from '@/components/Buttons/Button';
import { BlogCategoryItem } from '@/interfaces/blog';


interface CategoryListItemProps {
  category: BlogCategoryItem;
  onEdit: (category: BlogCategoryItem) => void;
  onDelete: (idx: number) => void;
  loading?: boolean;
}

const CategoryListItem: React.FC<CategoryListItemProps> = ({
  category,
  onEdit,
  onDelete,
  loading = false
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex items-center gap-1">
        <span className="text-lg font-semibold text-gray-800">
          {category.order || 0}. {category.categoryName}
        </span>
      </div>
      <div className="flex gap-2 w-full md:w-auto">
        <Button
          type="button"
          size="sm"
          color="bMain"
          onClick={() => onEdit(category)}
          disabled={loading}
          className="flex-1 md:flex-none hover:bg-gray-200 transition-colors"
        >
          수정
        </Button>
        <Button
          type="button"
          size="sm"
          color="bMain"
          onClick={() => onDelete(category.idx)}
          disabled={loading}
          className="flex-1 md:flex-none hover:bg-red-100 hover:text-red-600 transition-colors"
        >
          삭제
        </Button>
      </div>
    </div>
  );
};

export default CategoryListItem;