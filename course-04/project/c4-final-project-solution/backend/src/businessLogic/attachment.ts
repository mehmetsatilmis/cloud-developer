
import { AttachmentAccess } from '../dataLayer/attachmentAccess'
import { TodoAccess } from '../dataLayer/todosAccess'
import { InvalidArgumentError }  from '../errors/InvalidArgumentError'
import { NotFoundError }  from '../errors/NotFoundError'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { getUserId } from '../auth/utils'

const attachmentAccess = new AttachmentAccess()
const todosAccess = new TodoAccess()

export async function generatePresignedUrl(todoId: string, event: APIGatewayProxyEvent): Promise<String> {
    if(!todoId) {
        throw new InvalidArgumentError("Invalid todoId. Id is empty")
    }
    
    const userId = getUserId(event)
    const todoItem = await todosAccess.getTodoItem(todoId,userId);
    if(!todoItem || !todoItem.todoId) {
        throw new NotFoundError("TodoItem not found")
    }


    return attachmentAccess.getUploadUrl(todoId)
}

