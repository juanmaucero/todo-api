const defaultEnvs = () => {
    process.env.SERVER_HOST = 'localhost';
    process.env.SERVER_PORT = '5000';
    process.env.SERVER_SECURITY_HEADER = 'key';
    process.env.SERVER_SECURITY_KEY = 'challenge';
    process.env.DB_SOLUTION = 'LOKI';
    process.env.DB_LOCATION = 'loki.qa.db'
}

const wrongDbEnvs = () => {
    process.env.SERVER_HOST = 'localhost';
    process.env.SERVER_PORT = '5000';
    process.env.SERVER_SECURITY_HEADER = 'key';
    process.env.SERVER_SECURITY_KEY = 'challenge';
    process.env.DB_SOLUTION = 'MARIADB';
    process.env.DB_LOCATION = 'loki.qa.db'
}

export {defaultEnvs, wrongDbEnvs}