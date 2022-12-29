import { randomUUID } from "crypto";
import TaskInterface from "../interfaces/task.interface.js";

class Task implements TaskInterface {
    id: string;
    name: string;
    isDone: boolean;

    constructor(name: string) {
        this.id = randomUUID();
        this.name = name;
        this.isDone = false;
    }
}

export default Task;