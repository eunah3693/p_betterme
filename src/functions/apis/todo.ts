import { axiosInstance } from './axios';
import { TodoRequest, TodoResponse } from '@/interfaces/todo';

const TODO_URL = '/api/todo';

// Todo 조회
export const getTodo = async (params: TodoRequest): Promise<TodoResponse> => {
  try {
    console.log(params);
    const { data } = await axiosInstance.get<TodoResponse>(TODO_URL, {
      params,
    });
    console.log(data);
    return data;
  } catch (error) {
    console.error('월간 Todo 조회 실패:', error);
    throw error;
  }
};

// Todo 생성
export const createTodo = async (todoData: {
  memberId: string;
  subject: string;
  content?: string;
  finish?: string;
  startDate: string;
  finishDate: string;
}) => {
  try {
    const { data } = await axiosInstance.post(`${TODO_URL}/register`, todoData);
    return data;
  } catch (error) {
    console.error('Todo 생성 실패:', error);
    throw error;
  }
};

// Todo 수정
export const updateTodo = async (todoData: {
  idx: number;
  subject?: string;
  content?: string;
  finish?: string;
  startDate?: string;
  finishDate?: string;
}) => {
  try {
    const { idx, ...body } = todoData;
    const { data } = await axiosInstance.put(`${TODO_URL}/${idx}/update`, body);
    return data;
  } catch (error) {
    console.error('Todo 수정 실패:', error);
    throw error;
  }
};

// Todo 삭제
export const deleteTodo = async (idx: number) => {
  try {
    const { data } = await axiosInstance.delete(`${TODO_URL}/${idx}/delete`);
    return data;
  } catch (error) {
    console.error('Todo 삭제 실패:', error);
    throw error;
  }
};
