import { prisma } from '@/lib/prisma';
import { TodoItem, CreateTodoRequest, UpdateTodoRequest } from '@/interfaces/todo';
import { Prisma } from '@prisma/client';

export class TodoRepository {
  
  // DB 데이터를 TodoItem으로 변환
  private changeToTodoItem(dbRow: Prisma.TodoGetPayload<Record<string, never>>): TodoItem {
    return {
      idx: dbRow.idx,
      memberId: dbRow.memberId,
      subject: dbRow.subject,
      content: dbRow.content,
      finish: dbRow.finish,
      startDate: dbRow.startDate ? dbRow.startDate.toISOString().split('T')[0] : null,
      finishDate: dbRow.finishDate ? dbRow.finishDate.toISOString().split('T')[0] : null,
    };
  }

  // 특정 회원의 특정 기간의 Todo 조회
  // 조회 기간과 겹치는 모든 Todo를 가져옵니다 (startDate <= 조회종료일 AND finishDate >= 조회시작일)
  async getTodos(memberId: string, startDate: string, endDate: string): Promise<TodoItem[]> {
    const todoData = await prisma.todo.findMany({
      where: {
        memberId: memberId,
        AND: [
          {
            startDate: {
              lte: new Date(endDate), // Todo 시작일이 조회 종료일보다 작거나 같음
            }
          },
          {
            finishDate: {
              gte: new Date(startDate), // Todo 종료일이 조회 시작일보다 크거나 같음
            }
          }
        ]
      },
      orderBy: {
        startDate: 'asc'
      }
    });

    return todoData.map(todo => this.changeToTodoItem(todo));
  }

  // Todo 추가
  async createTodo(data: CreateTodoRequest): Promise<TodoItem> {
    const todo = await prisma.todo.create({
      data: {
        memberId: data.memberId,
        subject: data.subject,
        content: data.content || null,
        finish: data.finish || '0',
        startDate: data.startDate,
        finishDate: data.finishDate,
      }
    });

    return this.changeToTodoItem(todo);
  }

  // Todo 수정
  async updateTodo(idx: number, data: UpdateTodoRequest): Promise<TodoItem> {
    const todo = await prisma.todo.update({
      where: { idx },
      data
    });

    return this.changeToTodoItem(todo);
  }

  // Todo 삭제
  async deleteTodo(idx: number): Promise<void> {
    await prisma.todo.delete({
      where: { idx }
    });
  }

  // Todo 완료 상태 토글
  async toggleTodoFinish(idx: number): Promise<TodoItem> {
    const todo = await prisma.todo.findUnique({
      where: { idx }
    });

    if (!todo) {
      throw new Error('Todo not found');
    }

    const updatedTodo = await prisma.todo.update({
      where: { idx },
      data: {
        finish: todo.finish === '1' ? '0' : '1'
      }
    });

    return this.changeToTodoItem(updatedTodo);
  }
}