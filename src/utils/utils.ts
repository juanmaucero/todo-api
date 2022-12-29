import { FastifyReply, FastifyRequest } from "fastify";

class Utils {
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