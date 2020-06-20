import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { InvalidArgumentError } from "../errors/InvalidArgumentError";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";


export function validateCreateTodoReq(req : CreateTodoRequest) {
    if(!req || !req.name || req.name == '') {
        throw new InvalidArgumentError("name field cannot be empty")
    }

    if(!req || !req.dueDate || isNaN(Date.parse(req.dueDate))) {
        throw new InvalidArgumentError("dueDate invalid")
    }
}

export function validateUpdateTodoReq(req : UpdateTodoRequest) {
    if(!req || !req.name || req.name == '') {
        throw new InvalidArgumentError("name field cannot be empty")
    }

    if(!req || !req.dueDate || isNaN(Date.parse(req.dueDate))) {
        throw new InvalidArgumentError("dueDate invalid")
    }
}
