import DBInterface from "../ts/interfaces/db.interface.js";
import loki from 'lokijs';
import TaskInterface from "../ts/interfaces/task.interface.js";
import Task from "../ts/models/task.model.js";

class LokiDB implements DBInterface {
    db: Loki;

    constructor() {
        const self = this;
        this.db = new loki('./loki.db', {
            autoload: true,
            autoloadCallback : () => {
                self.initCollections()
            },
            autosave: true, 
            autosaveInterval: 1000,
            serializationMethod: "pretty",
        });
    }

    initCollections(): void {
        let entries = this.db.getCollection("tasks");
        if (entries === null) {
          entries = this.db.addCollection("tasks");
        }
    }

    createTask(task: TaskInterface): string {
        const col = this.db.getCollection("tasks");
        const result = col.insert(this.taskToSolution(task));
        return result.id;
    }

    updateTask(task: TaskInterface) {
        const col = this.db.getCollection("tasks");
        col.findAndUpdate((data) => data.id === task.id, (data) => {this.taskToSolution(task, data)});
    }

    getTask(id: string): TaskInterface | null {
        const col = this.db.getCollection("tasks");
        const result = col.find({id: id});
        if (result.length === 0) {
            return null;
        }
        return this.solutionToTask(result[0]);
    }

    listTasks(): TaskInterface[] {
        const col = this.db.getCollection("tasks");
        const tasks: TaskInterface[] = [];
        for (const entry of col.data) {
            tasks.push(this.solutionToTask(entry));
        }
        return tasks;
    }

    taskToSolution(task: TaskInterface, data: any = null): any {
        if (data !== null) {
            data.id = task.id;
            data.name = task.name;
            data.isDone = task.isDone;
            return data;
        }
        return {
            id: task.id,
            name: task.name,
            isDone: task.isDone
        };
    }

    solutionToTask(dbTask: any): TaskInterface {
        const task = new Task(dbTask.name);
        task.id = dbTask.id;
        task.isDone = dbTask.isDone;
        return task;
    }    
}

export default LokiDB;