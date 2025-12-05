import { useState } from 'react';
import Checkbox from '@/components/Forms/Checkbox';
import { cn } from '@/constants/cn';

export interface TodoItem {
  id: number;
  text: string;
  content?: string;
  completed: boolean;
  date?: string;
  startDate?: string;
  finishDate?: string;
}

interface TodoListProps {
  todos?: TodoItem[];
  onToggle?: (id: number) => void;
  onAdd?: (text: string) => void;
  onDelete?: (id: number) => void;
  className?: string;
}

function TodoList({
  todos: initialTodos = [],
  onToggle,
  onAdd,
  onDelete,
  className
}: TodoListProps) {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [newTodo, setNewTodo] = useState('');

  // 투두 완료/미완료 토글
  const handleToggle = (id: number) => {
    if (onToggle) {
      onToggle(id);
    } else {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    }
  };

  // 투두 추가
  const handleAdd = () => {
    if (newTodo.trim()) {
      if (onAdd) {
        onAdd(newTodo.trim());
      } else {
        const newTodoItem: TodoItem = {
          id: Date.now(),
          text: newTodo.trim(),
          completed: false,
        };
        setTodos([...todos, newTodoItem]);
      }
      setNewTodo('');
    }
  };

  // 투두 삭제
  const handleDelete = (id: number) => {
    if (onDelete) {
      onDelete(id);
    } else {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  // Enter 키 처리
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  // 통계
  const completedCount = (onToggle ? initialTodos : todos).filter(todo => todo.completed).length;
  const totalCount = (onToggle ? initialTodos : todos).length;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* 투두 입력 영역 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="할 일을 입력하세요"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
        />
        <button
          onClick={handleAdd}
          className="px-6 py-2 bg-main text-white rounded-md hover:bg-main/90 transition-colors whitespace-nowrap"
        >
          추가
        </button>
      </div>

      {/* 투두 리스트 */}
      <div className="flex flex-col gap-2">
        {(onToggle ? initialTodos : todos).length === 0 ? (
          <p className="text-gray-400 text-center py-8">등록된 할 일이 없습니다.</p>
        ) : (
          (onToggle ? initialTodos : todos).map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-md hover:shadow-sm transition-shadow"
            >
              <Checkbox
                checked={todo.completed}
                onChange={() => handleToggle(todo.id)}
                size="md"
                color="bMain"
              />
              <span
                className={cn(
                  'flex-1 text-gray-800',
                  todo.completed && 'line-through text-gray-400'
                )}
              >
                {todo.text}
              </span>
              <button
                onClick={() => handleDelete(todo.id)}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                삭제
              </button>
            </div>
          ))
        )}
      </div>

      {/* 통계 */}
      {totalCount > 0 && (
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-md text-sm text-gray-600">
          <span>
            완료: <span className="font-bold text-main">{completedCount}</span> / {totalCount}
          </span>
          <span>
            진행률: <span className="font-bold text-main">{Math.round((completedCount / totalCount) * 100)}%</span>
          </span>
        </div>
      )}
    </div>
  );
}

export default TodoList;

