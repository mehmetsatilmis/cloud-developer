import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import * as middy from "middy";
import { cors } from "middy/middlewares";
import { createTodoItem } from '../../businessLogic/todos';
import { createErrorResponse } from '../../utils/errorResponseUtils';

export const handler = middy (async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  try {
    const item = await createTodoItem(newTodo, event);

    return {
      statusCode: 201,
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