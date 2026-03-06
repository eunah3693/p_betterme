import React from 'react';
import Input from '@/components/Forms/Input';
import Button from '@/components/Buttons/Button';


interface CategoryAddFormProps {
  categoryName: string;
  onCategoryNameChange: (value: string) => void;
  order: string;
  onOrderChange: (value: string) => void;
  onAdd: () => void;
  loading?: boolean;
}

const CategoryAddForm: React.FC<CategoryAddFormProps> = ({
  categoryName,
  onCategoryNameChange,
  order,
  onOrderChange,
  onAdd,
  loading = false
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">카테고리 추가</h3>
      <div className="flex flex-col md:flex-row gap-3 md:items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리 이름 <span className="text-red-500">*</span>
          </label>
          <Input
            value={categoryName}
            onChange={(e) => onCategoryNameChange(e.target.value)}
            placeholder="예: 개발, 일상, 여행 등"
            size="md"
            color="bMain"
            disabled={loading}
          />
        </div>
        <div className="w-full md:w-20 lg:w-32">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            순서
          </label>
          <Input
            type="number"
            value={order}
            onChange={(e) => onOrderChange(e.target.value)}
            placeholder="0"
            size="md"
            color="bMain"
            disabled={loading}
          />
        </div>
        <div className="w-full md:w-auto md:pb-1">
          <Button
            type="button"
            size="md"
            color="bgMain"
            onClick={onAdd}
            disabled={loading}
            className="w-full md:w-auto hover:bg-main/90 transition-colors"
          >
            추가
          </Button>
        </div>
      </div>
      <p className="text-xs text-info mt-2">
        순서 숫자가 작을수록 먼저 표시됩니다.
      </p>
    </div>
  );
};

export default CategoryAddForm;