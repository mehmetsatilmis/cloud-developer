import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createErrorResponse } from '../../utils/errorResponseUtils';
import { deleteTodoItem } from '../../businessLogic/todos';
import { deleteAttachment } from '../../businessLogic/attachment';

import * as middy from "middy";
import { cors } from "middy/middlewares";

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  try {
    await deleteAttachment(todoId,event)
    const item = await deleteTodoItem(todoId, event)

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