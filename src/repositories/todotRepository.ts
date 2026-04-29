import { prisma } from '@/lib/prisma';
import { TodoItem, CreateTodoRequest, UpdateTodoRequest } from '@/interfaces/todo';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export class TodoRepository {
  private parseDate(value: string): Date {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error(`Invalid todo date: ${value}`);
    }

    const parsed = dayjs.utc(`${value}T00:00:00Z`);

    if (!parsed.isValid()) {
      throw new Error(`Invalid todo date: ${value}`);
    }

    return parsed.toDate();
  }

  private formatDate(value: Date): string {
    return dayjs.utc(value).format('YYYY-MM-DD');
  }

  private parseOptionalDate(value?: string): Date | undefined {
    if (!value) {
      return undefined;
    }

    return this.parseDate(value);
  }
  
  // DB 데이터를 TodoItem으로 변환
  private changeToTodoItem(dbRow: Prisma.TodoGetPayload<Record<string, never>>): TodoItem {
    return {
      idx: dbRow.idx,
      memberId: dbRow.memberId,
      subject: dbRow.subject,
      content: dbRow.content,
      finish: dbRow.finish,
      startDate: dbRow.startDate ? this.formatDate(dbRow.startDate) : null,
      finishDate: dbRow.finishDate ? this.formatDate(dbRow.finishDate) : null,
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
              lte: this.parseDate(endDate), // Todo 시작일이 조회 종료일보다 작거나 같음
            }
          },
          {
            finishDate: {
              gte: this.parseDate(startDate), // Todo 종료일이 조회 시작일보다 크거나 같음
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
        startDate: this.parseDate(data.startDate),
        finishDate: this.parseDate(data.finishDate),
      }
    });

    return this.changeToTodoItem(todo);
  }

  async updateTodoByIdxAndMemberId(
    idx: number,
    memberId: string,
    data: UpdateTodoRequest
  ): Promise<TodoItem | null> {
    const todo = await prisma.todo.findFirst({
      where: { idx, memberId }
    });

    if (!todo) {
      return null;
    }

    const updatedTodo = await prisma.todo.update({
      where: { idx },
      data: {
        ...data,
        startDate: this.parseOptionalDate(data.startDate),
        finishDate: this.parseOptionalDate(data.finishDate),
      }
    });

    return this.changeToTodoItem(updatedTodo);
  }

  async deleteTodoByIdxAndMemberId(idx: number, memberId: string): Promise<boolean> {
    const todo = await prisma.todo.findFirst({
      where: { idx, memberId }
    });

    if (!todo) {
      return false;
    }

    await prisma.todo.delete({
      where: { idx }
    });

    return true;
  }

}
