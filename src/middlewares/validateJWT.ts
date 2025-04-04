import {  NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";
import {ExtendedRequest} from "../ExtendedRequest";

const validateJWT = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const authorizationHeader = req.get('authorization');
    if (!authorizationHeader) {
        res.status(403).send('Authorization Header was not provided');
        return;
    }

    const token = authorizationHeader.split(" ")[1];
    if (!token) {
        res.status(403).send('Bearer token not found');
        return;
    }

    jwt.verify(token, "jMdHx#p%;lX>t6a", async (err, payload) => {
        if (err) {
            res.status(403).send("Invalid token");
            return;
        }

        if (!payload) {
            res.status(403).send("Invalid token payload");
            return;
        }

        const userPayload = payload as { email: string; firstName: string; lastName: string };
        const user = await userModel.findOne({ email: userPayload.email });
        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        req.user = user; // Assign the user to the request object
        next();
    });
};

export default validateJWT;