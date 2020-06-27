import { InvalidArgumentError } from '../errors/InvalidArgumentError'
import { NotFoundError } from '../errors/NotFoundError'
import { UnauthorizedError } from '../errors/UnauthorizedError'
import { createLogger } from "../utils/logger";

const logger = createLogger('createErrorResponse');


export function createErrorResponse(error : any) {
    logger.error(JSON.stringify({error: error}))

    if(error instanceof InvalidArgumentError) {
        return {
            statusCode: 400,
            body: JSON.stringify({
            error: error
            })
        }
    }

    if (error instanceof UnauthorizedError) {
        return {
            statusCode: 401,
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

    return {
        statusCode: 500,
        body: JSON.stringify({
            error: 'Internal server error'
        })
    }
}