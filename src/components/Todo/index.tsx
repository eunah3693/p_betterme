import { useState } from 'react';
import Checkbox from '@/components/Forms/Checkbox';
import { cn } from '@/constants/cn';

export interface TodoItem {
  id: number;
  text: string;
  content?: string;
  completed: boolean;
  date?: string;
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
          date: new Date().toISOString(),
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

  // Enter 키로 추가
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className={cn('bg-white rounded-lg shadow-sm p-6', className)}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-main">오늘의 할 일</h2>
        <span className="text-sm text-gray-500">
          {todos.filter(t => t.completed).length} / {todos.length} 완료
        </span>
      </div>

      {/* 투두 추가 입력 */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="할 일을 입력하세요..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
        />
        <button
          onClick={handleAdd}
          className="px-6 py-2 bg-main text-white rounded-md hover:bg-main/90 transition-colors whitespace-nowrap"
        >
          추가
        </button>
      </div>

      {/* 투두 리스트 */}
      <div className="space-y-3">
        {todos.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            아직 할 일이 없습니다. 추가해보세요! 📝
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border transition-all',
                todo.completed
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-white border-gray-300 hover:border-main'
              )}
            >
              {/* 체크박스 */}
              <Checkbox
                checked={todo.completed}
                onChange={() => handleToggle(todo.id)}
                size="md"
                color="bHighlight"
              />

              {/* 할 일 텍스트 */}
              <span
                className={cn(
                  'flex-1 text-base transition-all',
                  todo.completed
                    ? 'line-through text-gray-400'
                    : 'text-gray-800'
                )}
              >
                {todo.text}
              </span>

              {/* 삭제 버튼 */}
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-gray-400 hover:text-red-500 transition-colors px-2"
                title="삭제"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* 통계 */}
      {todos.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <span>전체: {todos.length}개</span>
            <span>진행중: {todos.filter(t => !t.completed).length}개</span>
            <span>완료: {todos.filter(t => t.completed).length}개</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoList;
