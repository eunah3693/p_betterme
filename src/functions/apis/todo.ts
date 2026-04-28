import { api } from './fetch';
import {
  CreateTodoRequest,
  TodoRequest,
  TodoResponse,
  UpdateTodoRequest,
} from '@/interfaces/todo';

const TODO_URL = '/api/todo';

// Todo 조회
export const getTodo = async (params: TodoRequest): Promise<TodoResponse> => {
  try {
    return await api.get<TodoResponse>(TODO_URL, params);
  } catch (error) {
    console.error('월간 Todo 조회 실패:', error);
    throw error;
  }
};

// Todo 생성 (POST /api/todo)
export const createTodo = async (todoData: CreateTodoRequest) => {
  try {
    return await api.post(TODO_URL, todoData);
  } catch (error) {
    console.error('Todo 생성 실패:', error);
    throw error;
  }
};

// Todo 수정 (PUT /api/todo/:idx)
export const updateTodo = async (
  todoData: { idx: number } & UpdateTodoRequest
) => {
  try {
    const { idx, ...body } = todoData;
    return await api.put(`${TODO_URL}/${idx}`, body);
  } catch (error) {
    console.error('Todo 수정 실패:', error);
    throw error;
  }
};

// Todo 삭제 (DELETE /api/todo/:idx)
export const deleteTodo = async (idx: number) => {
  try {
    return await api.delete(`${TODO_URL}/${idx}`);
  } catch (error) {
    console.error('Todo 삭제 실패:', error);
    throw error;
  }
};
