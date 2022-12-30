import DBInterface from "../ts/interfaces/db.interface.js";
import LokiDB from "./loki.js";

// Force and lock class references object
const classReferences = {
    'LOKI': LokiDB,
} as const;

// DBTypes are the keys of the object 'classReferences'
type DBTypes = keyof typeof classReferences;

// Boolean that indicates if the given string is of DBTypes
function isValidDBType(dbSolution : string): dbSolution is DBTypes {
    return Object.keys(classReferences).indexOf(dbSolution) !== -1;
}

/**
 * This class a singleton + factory pattern. It generates a singleton of itself so that connections
 * to the DB aren't being renewed constantly and it generates the selected database indicated
 * on the env vars. In case that DB doesn't exist, it will throw an error.
 */
class DBFactory {

    private static instance: DBFactory;
    public db: DBInterface;

    private constructor() {
        const dbSolution: string = String(process.env.DB_SOLUTION);
        if(!isValidDBType(dbSolution)) {
            throw new Error(`DB ${dbSolution} is not implemented`);
        }
        // Init the selected DB
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