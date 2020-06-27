import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { NotFoundError }  from '../errors/NotFoundError'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate'

const logger = createLogger("todoAccessLogger")

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODO_TABLE,
    private readonly todoUserIdx = process.env.TODO_USER_ID_INDEX) {
  }

  async getAllTodos(userId : string): Promise<TodoItem[]> {
    logger.info('GetAllTodos called for userId : ' + userId )

    const result =await this.docClient.query({
        TableName: this.todosTable,
        IndexName: this.todoUserIdx,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async getTodoItem(todoId: string, userId : string): Promise<TodoItem> {
    logger.info('getTodoItem called for userId : ' + userId + ' and todoId : ' + todoId )

    const todos = await this.docClient.query({
        TableName: this.todosTable,
        IndexName: this.todoUserIdx,
        KeyConditionExpression: 'todoId = :todoId and userId = :userId',
        ExpressionAttributeValues: {
            ':todoId': todoId,
            ':userId': userId
        }
    }).promise()
    
    if(!todos || !todos.Items || todos.Items.length == 0) {
        throw new NotFoundError("Invalid todoId")
    }

    return todos.Items[0] as TodoItem
  }

  async deleteTodo(todoItem: TodoItem): Promise<TodoItem> {
    logger.info('deleteTodo called for userId : ' + todoItem.userId + ' and todoId : ' + todoItem.todoId )

    const response = await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
          "userId": todoItem.userId,
          "todoId": todoItem.todoId
      },
      ReturnValues: "ALL_OLD"
    }).promise()

    if(!response.Attributes) {
      throw new Error('Delete Failed for userId : ' + todoItem.userId + ' and todoId : ' + todoItem.todoId)
    }
    
    return response.Attributes as TodoItem
  }

  async updateTodo(todoItem: TodoItem, updatedTodo: UpdateTodoRequest): Promise<TodoUpdate> {
    logger.info('updateTodo called for userId : ' + todoItem.userId + ' and todoId : ' + todoItem.todoId )

    const updatedTodoResponse = await this.docClient.update({
      TableName: this.todosTable,
      Key: {
          "userId": todoItem.userId,
          "todoId": todoItem.todoId
      },
      UpdateExpression: 'set #nameattr = :nameattr, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        '#nameattr': 'name'
      },
      ExpressionAttributeValues: {
          ":nameattr": updatedTodo.name,
          ":dueDate": updatedTodo.dueDate,
          ":done": updatedTodo.done
      },
      ReturnValues: "UPDATED_NEW"
    }).promise()
    
    if(!updatedTodoResponse || !updatedTodoResponse.Attributes) {
      throw new Error('Update Failed for userId : ' + todoItem.userId + ' and todoId : ' + todoItem.todoId)
    }

    return updatedTodoResponse.Attributes as TodoUpdate
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    logger.info('createTodo called for userId : ' + todoItem.userId + ' and todoId : ' + todoItem.todoId )

    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()

    return todoItem
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
