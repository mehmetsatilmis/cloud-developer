import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from "middy";
import { cors } from "middy/middlewares";
import { getAllTodoItems } from '../../businessLogic/todos';
import { createErrorResponse } from '../../utils/errorResponseUtils';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  try {
    const items = await getAllTodoItems(event)
    return {
      statusCode: 200,
      body: JSON.stringify({ items : items })
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