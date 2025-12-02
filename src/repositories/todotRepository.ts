import { prisma } from '@/lib/prisma';
import { TodoItem } from '@/interfaces/todo';
import { Prisma } from '@prisma/client';

export class TodoRepository {
  
  // DB 데이터를 TodoItem으로 변환
  private changeToTodoItem(dbRow: Prisma.TodoGetPayload<Record<string, never>>): TodoItem {
    return {
      idx: dbRow.idx,
      memberId: dbRow.memberId,
      projectId: dbRow.projectId,
      subject: dbRow.subject,
      content: dbRow.content,
      finish: dbRow.finish,
      date: dbRow.date ? dbRow.date.toISOString().split('T')[0] : null,
    };
  }

  // 특정 회원의 특정 기간의 Todo 조회
  async getTodos(memberId: string, startDate: string, endDate: string): Promise<TodoItem[]> {
    const todoData = await prisma.todo.findMany({
      where: {
        memberId: memberId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    return todoData.map(todo => this.changeToTodoItem(todo));
  }

  // Todo 추가
  async createTodo(data: {
    memberId: string;
    projectId?: string;
    subject: string;
    content?: string;
    finish?: string;
    date: Date;
  }): Promise<TodoItem> {
    const todo = await prisma.todo.create({
      data: {
        memberId: data.memberId,
        projectId: data.projectId || null,
        subject: data.subject,
        content: data.content || null,
        finish: data.finish || 'N',
        date: data.date,
      }
    });

    return this.changeToTodoItem(todo);
  }

  // Todo 수정
  async updateTodo(idx: number, data: {
    subject?: string;
    content?: string;
    finish?: string;
    date?: Date;
  }): Promise<TodoItem> {
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
        finish: todo.finish === 'Y' ? 'N' : 'Y'
      }
    });

    return this.changeToTodoItem(updatedTodo);
  }
}