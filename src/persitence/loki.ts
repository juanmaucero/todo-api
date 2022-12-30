import DBInterface from "../ts/interfaces/db.interface.js";
import loki from 'lokijs';
import TaskInterface from "../ts/interfaces/task.interface.js";
import Task from "../ts/models/task.model.js";

/**
 * Wrapper of the loki DB type. It also implements the DBInterface that all DBs must adhere to.
 */
class LokiDB implements DBInterface {
    db: Loki;

    /**
     * Constructor initializes the DB, so it must be called first thing on the app
     */
    constructor() {
        const self = this;
        this.db = new loki(String(process.env.DB_LOCATION), {
            autoload: true,
            autoloadCallback : () => {
                self.initCollections()
            },
            autosave: true, 
            autosaveInterval: 1000,
            serializationMethod: "pretty",
        });
    }

    /**
     * Create collections if they do not exist
     */
    initCollections(): void {
        let entries = this.db.getCollection("tasks");
        if (entries === null) {
          entries = this.db.addCollection("tasks");
        }
    }

    /**
     * Insert task on the DB
     * @param task 
     * @returns the id of the task on the DB.
     */
    createTask(task: TaskInterface): string {
        const col = this.db.getCollection("tasks");
        const result = col.insert(this.taskToSolution(task));
        return result.id;
    }

    /**
     * Updates task on the DB
     * @param task 
     */
    updateTask(task: TaskInterface) {
        const col = this.db.getCollection("tasks");
        col.findAndUpdate((data) => data.id === task.id, (data) => {this.taskToSolution(task, data)});
    }

    /**
     * Gets specific task on the DB.
     * @param id 
     * @returns the task if found else null
     */
    getTask(id: string): TaskInterface | null {
        const col = this.db.getCollection("tasks");
        const result = col.find({id: id});
        if (result.length === 0) {
            return null;
        }
        return this.solutionToTask(result[0]);
    }

    /**
     * List all tasks on the collection
     * @returns list of tasks
     */
    listTasks(): TaskInterface[] {
        const col = this.db.getCollection("tasks");
        const tasks: TaskInterface[] = [];
        for (const entry of col.data) {
            tasks.push(this.solutionToTask(entry));
        }
        return tasks;
    }

    /**
     * Converts task model to the model expected by the DB
     * @param task task model
     * @param data db task model to update db reference
     * @returns db representation object
     */
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

    /**
     * Converts db object to task model
     * @param dbTask db representation of the task
     * @returns task model
     */
    solutionToTask(dbTask: any): TaskInterface {
        const task = new Task(dbTask.name);
        task.id = dbTask.id;
        task.isDone = dbTask.isDone;
        return task;
    }    
}

export default LokiDB;