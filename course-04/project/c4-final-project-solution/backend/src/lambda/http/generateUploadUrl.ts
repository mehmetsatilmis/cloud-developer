import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { generatePresignedUrl } from '../../businessLogic/attachment'
import { InvalidArgumentError } from '../../errors/InvalidArgumentError'
import { NotFoundError } from '../../errors/NotFoundError'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId


  try {
    const url = await generatePresignedUrl(todoId) 
    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl : url })
    }

  } catch (error) {
    if(error instanceof InvalidArgumentError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: error
        })
      }
    }

    if(error instanceof NotFoundError) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Todo does not exist'
        })
    }
    
  }


})


handler.use(
  cors({
    credentials: true
  })
)