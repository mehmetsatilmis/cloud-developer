import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { generatePresignedUrl } from '../../businessLogic/attachment'
import { createErrorResponse } from '../../utils/errorResponseUtils'


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId


  try {
    const url = await generatePresignedUrl(todoId, event) 
    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl : url })
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