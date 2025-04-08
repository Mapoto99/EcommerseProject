import express from "express";
import { addItemToCart, checkout, clearCart, deleteItemInCart, getActiveCartForUser, updateItemInCart } from "../services/cartService";
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

router.put('/items', validateJWT, async (req: ExtendedRequest,res)=>{
    const userID = req?.user?._id;
    const {productID, quantity} = req.body;
    const response = await updateItemInCart({userID,productID, quantity});
    res.status(response.statusCode).send(response.data);
})

router.delete('/items/:productID', validateJWT, async (req: ExtendedRequest,res)=>{
    const userID = req?.user?._id;
    const {productID} = req.params;
    const response = await deleteItemInCart({productID,userID});
    res.status(response.statusCode).send(response.data);
})

router.delete('/', validateJWT, async (req: ExtendedRequest,res)=>{
    const userID = req?.user?._id;
    const response = await clearCart({userID});
    res.status(response.statusCode).send(response.data);
})

router.post('/checkout', validateJWT, async (req: ExtendedRequest,res)=>{
    const userID = req?.user?._id;
    const {address}=req.body;
    const response = await checkout({userID,address});
    res.status(response.statusCode).send(response.data);
})


export default router;