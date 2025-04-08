import { cartModel } from "../models/cartModel";
import productModel from "../models/productModel";
import { IOrderItem, orderModel } from "../models/orderModel";

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
interface ClearCart{
    userID: string;
}
export const clearCart = async ({userID}: ClearCart) =>{
    const cart = await getActiveCartForUser({userID});
    cart.items=[]
    cart.totalAmount=0;
    const updatedCart = cart.save();
    return {data:updatedCart,statusCode:200}
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

interface UpdateItemInCart{
    productID: any;
    userID: string;
    quantity: number;
}

export const updateItemInCart = async ({productID, userID,quantity}: UpdateItemInCart)=>{
    const cart = await getActiveCartForUser({userID});

    const product = await productModel.findById(productID);
    if(!product){
        return {data:"product not found", statusCode: 400 }
    }

    if(product.stock<quantity){
        return {data:"Low stock for item", statusCode: 400 }
    }


    const existInCart = cart.items.find((p) => p.product.toString() === productID.toString());

    if(!existInCart){
        return {data: "Item does not exists in Cart!", statusCode: 400};
    }

    const otherCartItems = cart.items.filter((p) => p.product.toString() != productID.toString());
    let total = otherCartItems.reduce((sum,product)=>{
        sum+=product.quantity*product.unitPrice;
        return sum;
    },0);
    existInCart.quantity=quantity;

    total += existInCart.quantity*existInCart.unitPrice;
    cart.totalAmount=total;
    const updatedCart = await cart.save();
    return {data:updatedCart, statusCode: 200 }
}
interface DeleteItemInCart{
    productID: any;
    userID: string;
}


export const deleteItemInCart = async ({productID, userID}: DeleteItemInCart)=>{
    const cart = await getActiveCartForUser({userID});

    const existInCart = cart.items.find((p) => p.product.toString() === productID.toString());

    if(!existInCart){
        return {data: "Item does not exists in Cart!", statusCode: 400};
    }

    const otherCartItems = cart.items.filter((p) => p.product.toString() != productID.toString());
    let total = otherCartItems.reduce((sum,product)=>{
        sum+=product.quantity*product.unitPrice;
        return sum;
    },0);
    cart.items=otherCartItems;
    cart.totalAmount=total;
    const updatedCart = await cart.save();
    return {data:updatedCart, statusCode: 200 }
}

interface Checkout{
    userID: string;
    address: string;
}

export const checkout = async ({userID, address}: Checkout)=>{
    
    if(!address){
        return {data: "Please enter the address", statusCode: 400};
    }
    
    const cart = await getActiveCartForUser({userID});
    const orderItems:IOrderItem[] = [];
    
    // Loop over Cart Items and create orderItems
    for(const item of cart.items){
        const product=await productModel.findById(item.product);
        if(!product){
            return {data: "Product Not Found", statusCode: 400};

        }
        const orderItem: IOrderItem ={
            productTitle: product?.title,
            productImage: product?.image,
            unitPrice: item.unitPrice,
            quantity: item.quantity    
        }
        orderItems.push(orderItem);
    }
    const order = await orderModel.create({
        orderItems,
        userID,
        total:cart.totalAmount,
        address
    });
    await order.save();
    // update the cart status to be completed
    cart.status="completed";
    await cart.save();
    return {data:order, statusCode:200}
}
