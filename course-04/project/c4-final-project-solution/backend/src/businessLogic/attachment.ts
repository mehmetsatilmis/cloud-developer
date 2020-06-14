
import { AttachmentAccess } from '../dataLayer/attachmentAccess'
import { TodoAccess } from '../dataLayer/todosAccess'
import { InvalidArgumentError }  from '../errors/InvalidArgumentError'
import { NotFoundError }  from '../errors/NotFoundError'

const attachmentAccess = new AttachmentAccess()
const todosAccess = new TodoAccess()

export async function generatePresignedUrl(todoId: string): Promise<String> {
    if(!todoId) {
        throw new InvalidArgumentError("Invalid todoId. Id is empty")
    }

    const todoItem = await todosAccess.getTodoItem(todoId);
    if(!todoItem || !todoItem.todoId) {
        throw new NotFoundError("TodoItem not found")
    }


    return attachmentAccess.getUploadUrl(todoId)
}

