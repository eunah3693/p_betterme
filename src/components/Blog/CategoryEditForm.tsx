import React from 'react';
import Input from '@/components/Forms/Input';
import Button from '@/components/Buttons/Button';


interface CategoryEditFormProps {
  categoryIdx: number;
  editName: string;
  onEditNameChange: (value: string) => void;
  editOrder: string;
  onEditOrderChange: (value: string) => void;
  onSave: (idx: number) => void;
  onCancel: () => void;
  loading?: boolean;
}

const CategoryEditForm: React.FC<CategoryEditFormProps> = ({
  categoryIdx,
  editName,
  onEditNameChange,
  editOrder,
  onEditOrderChange,
  onSave,
  onCancel,
  loading = false
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-end">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          카테고리 이름
        </label>
        <Input
          value={editName}
          onChange={(e) => onEditNameChange(e.target.value)}
          placeholder="카테고리 이름"
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
          value={editOrder}
          onChange={(e) => onEditOrderChange(e.target.value)}
          placeholder="0"
          size="md"
          color="bMain"
          disabled={loading}
        />
      </div>
      <div className="flex gap-2 w-full md:w-auto md:pb-1">
        <Button
          type="button"
          size="md"
          color="bMain"
          onClick={() => onSave(categoryIdx)}
          disabled={loading}
          className="flex-1 md:flex-none"
        >
          저장
        </Button>
        <Button
          type="button"
          size="md"
          color="bMain"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 md:flex-none"
        >
          취소
        </Button>
      </div>
    </div>
  );
};

export default CategoryEditForm;