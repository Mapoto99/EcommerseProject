import { cartModel } from "../models/cartModel";
import productModel from "../models/productModel";

interface createCartForUser{
    userID: string;
}
const createCartForUser = async ({userID}:createCartForUser) =>{
    const cart = await cartModel.create({userID, totalAmount:0});
    await cart.save();
    return cart;
}

interface GetActiveCartForUser{
    userID: string;
}

export const getActiveCartForUser = async ({userID}: GetActiveCartForUser) =>{
    let cart = await cartModel.findOne({userID, status:"active"});
    if(!cart){
        cart = await createCartForUser({userID});
    }
    return cart;
}

interface AddItemToCart{
    productID: any;
    userID: string;
    quantity: number;
}

export const addItemToCart = async ({productID, userID,quantity}: AddItemToCart)=>{
    const cart = await getActiveCartForUser({userID});

    const existInCart = cart.items.find((p) => p.product.toString() === productID.toString());

    if(existInCart){
        return {data: "Item already exists in Cart!", statusCode: 400};
    }

    const product = await productModel.findById(productID);
    if(!product){
        return {data:"product not found", statusCode: 400 }
    }

    if(product.stock<quantity){
        return {data:"Low stock for item", statusCode: 400 }
    }

    cart.items.push({
        product: productID,
        unitPrice: product.price,
        quantity,
    });
    cart.totalAmount+=product.price*quantity;

    const updatedCart = await cart.save();
    return {data:updatedCart, statusCode: 200 }
}
