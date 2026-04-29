import { TodoRepository } from '@/repositories/todotRepository';
import {
  CreateTodoRequest,
  TodoItem,
  TodoRequest,
  TodoResponse,
  UpdateTodoRequest,
} from '@/interfaces/todo';

export class TodoService {
  private todoRepository: TodoRepository;
  
  constructor() {
    this.todoRepository = new TodoRepository();
  }
  
  // Todo 조회
  async viewTodo({ memberId, startDate, endDate }: TodoRequest): Promise<TodoResponse> {
    try {
      const todos = await this.todoRepository.getTodos(memberId, startDate, endDate);
      return {
        success: true,
        data: todos
      };
    } catch (error) {
      console.error('월간 Todo 조회 실패:', error);
      return {
        success: false,
        data: []
      };
    }
  }
  
  // Todo 추가
  async createTodo(data: CreateTodoRequest): Promise<TodoItem> {
    return await this.todoRepository.createTodo(data);
  }
  
  // Todo 수정
  async updateTodo(idx: number, memberId: string, data: UpdateTodoRequest): Promise<TodoItem | null> {
    return await this.todoRepository.updateTodoByIdxAndMemberId(idx, memberId, data);
  }
  
  // Todo 삭제
  async deleteTodo(idx: number, memberId: string): Promise<boolean> {
    return await this.todoRepository.deleteTodoByIdxAndMemberId(idx, memberId);
  }
}
