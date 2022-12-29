import TaskInterface from "./task.interface.js";

interface DBInterface {
    createTask: (task: TaskInterface) => string; 
    listTasks: () => Array<TaskInterface>;
    solutionToTask: (dbTask: any) => TaskInterface;
    taskToSolution: (task: TaskInterface) => object
    updateTask: (task: TaskInterface) => void;
    getTask: (id: string) => TaskInterface | null;
}

export default DBInterface;