import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "./config";


export const authMiddleware = (req:any, res:any, next:any) => {
    const authHeader = req.headers['authorization'] || "";

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            message: "Provide Token / Incorrect Token"
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded:any = verify(token, JWT_SECRET);

        if(decoded && decoded.userId){
            req.userId = String(decoded.userId);
            next();
        }

    } catch (err) {
        return res.status(403).json({
            message: "Token Verification Failed"
        });
    }
};

