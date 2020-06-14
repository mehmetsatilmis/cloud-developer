import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { getUserId } from '../auth/utils'
import { APIGatewayProxyEvent } from 'aws-lambda'

const todoAccess = new TodoAccess()
const bucketName = process.env.IMAGES_S3_BUCKET

export async function getAllTodoItems(event: APIGatewayProxyEvent): Promise<TodoItem[]> {
  const userId = getUserId(event)
  return todoAccess.getAllTodos(userId)
}

export async function getTodoItem(todoId: string, event: APIGatewayProxyEvent): Promise<TodoItem> {
  const userId = getUserId(event)
  return todoAccess.getTodoItem(todoId, userId)
}

export async function createTodoItem(
  createTodoRequest: CreateTodoRequest,
  event: APIGatewayProxyEvent
): Promise<TodoItem> {

  const todoId = uuid.v4()
  const userId = getUserId(event)

  return await todoAccess.createTodo({
    userId: userId,
    todoId: todoId,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`

  })

}


