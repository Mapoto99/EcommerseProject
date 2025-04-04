import express from "express";
import { addItemToCart, getActiveCartForUser } from "../services/cartService";
import validateJWT from "../middlewares/validateJWT";
import { ExtendedRequest } from "../ExtendedRequest";

const router = express.Router();

router.get("/",validateJWT, async (req:ExtendedRequest,res ) =>{
    const userID = req?.user?._id;
    const cart =await getActiveCartForUser({userID});
    res.status(200).send(cart);
})

router.post('/items', validateJWT, async (req: ExtendedRequest,res)=>{
    const userID = req?.user?._id;
    const {productID, quantity} = req.body;
    const response = await addItemToCart({userID,productID, quantity});
    res.status(response.statusCode).send(response.data);
})


export default router;