import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { NotFoundError }  from '../errors/NotFoundError'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
//import { TodoUpdate } from '../models/TodoUpdate'

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODO_TABLE,
    private readonly todoUserIdx = process.env.TODO_USER_ID_INDEX) {
  }

  async getAllTodos(userId : string): Promise<TodoItem[]> {
    console.log('Getting all groups')

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

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
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
