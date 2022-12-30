import { FastifyRequest } from "fastify";

/**
 * Utils class, exposing static methods to use wherever necessary.
 */
class Utils {
    /**
     * Function that checks if security key and value come in the request's headers
     * @param request 
     * @returns boolean that indicates if it's authorized to access API.
     */
    static isAuthorized(request: FastifyRequest) {
        const securityHeader = String(process.env.SERVER_SECURITY_HEADER);
        const securityKey = String(process.env.SERVER_SECURITY_KEY);
        if (Object.keys(request.headers).indexOf(securityHeader) != -1) {
            return request.headers[securityHeader] === securityKey;
        }
        return false;
    }
}

export default Utils;