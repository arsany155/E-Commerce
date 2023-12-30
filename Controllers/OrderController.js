const {order} = require("../models/OrderModel")
const asynchandler = require("express-async-handler")
const {Cart}=require("../models/CartModel")
const {Product}=require("../models/ProductsModel")
const {User}=require("../models/UserModel")
var paypal = require('paypal-rest-sdk');
const path = require("path")
/** 
* @desc     create cash order 
* @route    /api/orders/cartid
* @method   Post
* @access   public
*/ 
const createCashOrder = asynchandler(async(req,res) => {
    const  taxPrice = 0
    const shippingPrice = 0
    // 1)get cart depend on cartid
    const cart = await Cart.findById(req.params.id)
    if(!cart){
        return res.json({msg: "there is no cart with this id"})
    }

    // 2) get order price depends on cart price "check if coupon apply to take price after discount"
    const cartprice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice
    const totalOrderPrice = cartprice + taxPrice + shippingPrice

    // 3) create order with defaulr paymentMethod type cash
    const Order = await order.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        totalOrderPrice,
        shippingAddress: req.body.shippingAddress
    })

    if(Order){
        // 4) After creating order , decrement product quantity and increment product sold
        const bulkOption = cart.cartItems.map((item) => ({
            updateOne: {
                filter: {_id: item.product },
                update: {$inc: {quantity: -item.quantity , sold: +item.quantity}}
            }
        }))
    
        await Product.bulkWrite(bulkOption , {})

        //5) clear cart of the user 
        await Cart.findByIdAndDelete(req.params.id)
    }

    res.json({data: Order})
})


/** 
* @desc     Get all orders
* @route    /api/orders
* @method   Post
* @access   public
*/
const getOrders = asynchandler(async(req,res) => {
    const user = await User.findById(req.user._id)
    let Order 
    if(user.role == "user"){
        Order = await order.find({user: req.user._id}) 
        res.json({data: Order})
    }else{
        Order = await order.find() 
        res.json({data: Order})
    }
})



/** 
* @desc     Get all orders
* @route    /api/orders
* @method   Post
* @access   public
*/
const getOrderbyid = asynchandler(async(req,res) => {
    const Order = await order.findById(req.params.id)
    res.json({data: Order })
})


/** 
* @desc     Update order to paid
* @route    /api/orders/:id/paid
* @method   Put
* @access   private (admin)
*/
const UpdateOrdertoPaid = asynchandler(async(req,res) => {
    const Order = await order.findById(req.params.id)

    Order.isPaid =true 
    Order.paidAt = Date.now()
    const updateOrder = await order.save()
    res.json({data: updateOrder})
})




/** 
* @desc     Update order to deliver
* @route    /api/orders/:id/deliver
* @method   Put
* @access   private (admin)
*/
const UpdateOrdertoDeliver = asynchandler(async(req,res) => {
    const Order = await order.findById(req.params.id)

    Order.isDelivered =true 
    Order.deliveredAt = Date.now()
    const updateOrder = await order.save()
    res.json({data: updateOrder})
})





const index = asynchandler ((req, res) => {
    const htmlPath = path.join(__dirname, '../view/index.html');
    res.sendFile(htmlPath);
});

paypal.configure({
    mode: 'sandbox', 
    client_id: 'AaTyk2RB3dzGZ4zFZ5S3R4VLuRsyVWhpu2Dqi94RcrdWdDXE7Nu4ErLcvxGK3YMeQupsADuJ9xhjRPf7',
    client_secret: 'EEKD2SZQdcKk3EUknvOgl2Pz0bJA4uYH9qGswZjf3_uYR8HAo5Pt5InrS1NOcoJrG5_vhA2Lf_uAZbjF'
});
const PayByPayPall = asynchandler(async(req,res) => {
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:8000/api/check/success",
            "cancel_url": "http://localhost:8000/api/check/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "100.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "100.00"
            },
            "description": "This is the payment description."
        }]
    };
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            payment = payment.links.filter((data) => data.rel == 'approval_url')[0]
            console.log(payment.href)
            redirect_url = payment.href
            res.json({ link: redirect_url})
        }
    });
})

const success = asynchandler(async (req, res) => {
        const execute_payment_json = {
            "payer_id": req.query.PayerID,
            "transactions": [{
                "amount": {
                    "currency": 'USD',
                    "total": '100.00'
                }
            }]
        };
        var paymentId = req.query.paymentId;
        paypal.payment.execute(paymentId , execute_payment_json, function(error , payment){
            if(error)
            {
                console.log(error.response)
                throw error
            }else{
                console.log("get payment Response")
                console.log(JSON.stringify(payment))
                res.send(JSON.stringify(payment))
            }
        })
});

const cancel = asynchandler(async (req,res) => {
    res.send('the payment was canceled')
})




module.exports={
    createCashOrder,
    getOrders,
    getOrderbyid,
    UpdateOrdertoPaid,
    UpdateOrdertoDeliver,
    index,
    PayByPayPall,
    success,
    cancel
}