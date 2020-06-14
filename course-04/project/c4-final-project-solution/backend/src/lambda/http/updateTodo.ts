import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createErrorResponse } from '../../utils/errorResponseUtils'
import { updateTodoItem } from '../../businessLogic/todos'

import * as middy from "middy";
import { cors } from "middy/middlewares";

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  try {
    const item = await updateTodoItem(todoId, updatedTodo, event);

    return {
      statusCode: 200,
      body: JSON.stringify({
        item
      })
    }
  } catch (error) {
    return createErrorResponse(error)
  }
})

handler.use(
  cors({
    credentials: true
  })
)