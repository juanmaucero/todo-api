import DBInterface from "../ts/interfaces/db.interface.js";
import LokiDB from "./loki.js";

const classReferences = {
    'LOKI': LokiDB,
} as const;

type DBTypes = keyof typeof classReferences;

function isValidDBType(dbSolution : string): dbSolution is DBTypes {
    return Object.keys(classReferences).indexOf(dbSolution) !== -1;
}

class DBFactory {

    private static instance: DBFactory;
    public db: DBInterface;

    private constructor() {
        const dbSolution: string = String(process.env.DB_SOLUTION);
        if(!isValidDBType(dbSolution)) {
            throw new Error(`DB ${dbSolution} is not implemented`);
        }
        this.db = new classReferences[dbSolution]();
    }

    public static getInstance(): DBFactory {
        if (!DBFactory.instance) {
            DBFactory.instance = new DBFactory();
        }
        return DBFactory.instance;
    }
}

export default DBFactory;