'use client'
import { Trash2, Calendar } from 'lucide-react'
import Image from 'next/image'
import { CartItem } from '@/interfaces/cart.interface'

interface CartComponentInterface {
    cartItems:CartItem[];
    eventDate:string;
    setEventDate:(str:string)=>void;
    updateQuantity:(id:number,delta:number)=>void;
    removeItem:(id:number)=>void;
    remainingForFreeShipping:number;
    payable:number;
    cartTotal:number;
    shipping:number;
    router:any
}
const CartComponent = (props:CartComponentInterface) => {
    const {
        cartItems,
        eventDate,
        payable,
        remainingForFreeShipping,
        removeItem,
        setEventDate,
        updateQuantity,
        cartTotal,
        shipping,
        router
    } = props
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
            {/* Left: Shopping Items */}
            <div className="md:col-span-2 space-y-6">
                <div>
                    <h2 className="text-sm font-bold uppercase flex items-center gap-2">
                        <Image
                            src="/assets/SVG/icons/cart.svg"
                            alt="Logo"
                            width={20}
                            height={30}
                            className="object-cover"
                        />
                        My Shopping Bag ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})
                    </h2>
                    <p className="text-sm mt-2 flex items-center gap-2">
                        <span>Event Date: {eventDate}</span>
                        <button className="text-sm text-[#D6A680] underline flex items-center gap-1">
                            <Image
                                src="/assets/SVG/icons/edit.svg"
                                alt="Logo"
                                width={20}
                                height={30}
                                className="object-cover"
                            /> Edit
                        </button>
                    </p>
                </div>

                <div className="space-y-4">
                    {cartItems.map(item => (
                        <div
                            key={item.id}
                            className="flex flex-col sm:flex-row gap-4 border-b pb-4"
                        >
                            <div className="w-full sm:w-[100px] md:w-[120px] lg:w-[150px] xl:w-[180px] flex-shrink-0">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={150}
                                    height={200}
                                    quality={100}
                                    className="w-full h-[160px] sm:h-[140px] object-cover rounded"
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-sm">Rent / {item.size}</p>
                                <p className="text-sm text-gray-500">Ships in 2-3 business days.</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="border px-2"
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="border px-2"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-row sm:flex-col justify-between sm:items-end items-start gap-2 sm:gap-0 mt-2 sm:mt-0">
                                <span className="font-semibold">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-sm text-gray-600 flex items-center gap-1"
                                >
                                    <Trash2 size={14} /> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Right: Summary */}
            <div className="space-y-6">
                <div className="border p-4 rounded-md">
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                        <Image
                            src="/assets/SVG/icons/copy.svg"
                            alt="Logo"
                            width={20}
                            height={30}
                            className="object-cover"
                        />
                        Order Summary
                    </h3>
                    <p className="text-sm text-gray-600">Jul 29: Last day to return without fees</p>

                    <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Cart Total ({cartItems.length})</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping (Standard):</span>
                            <span>$ {shipping.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="border-t mt-4 pt-4 font-semibold text-md flex justify-between">
                        <span>Payable Amount</span>
                        <span>${payable.toFixed(2)}</span>
                    </div>

                    {remainingForFreeShipping > 0 && (
                        <div className="bg-[#F6F6F6] text-sm p-2 mt-2 rounded">
                            You're ${remainingForFreeShipping} away from free standard shipping!
                        </div>
                    )}

                    <p className="text-sm mt-2 text-gray-600">
                        If renting, shipment would arrive by Jul.14
                    </p>

                    <button className="mt-4 w-full cursor-pointer bg-black text-white py-2 text-sm rounded hover:bg-gray-900"
                        onClick={()=>{
                            router.push("/checkout")
                        }}
                    >
                        CHECKOUT
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 grid-cols-3 shadow-lg gap-4 text-center text-xs text-gray-700">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="bg-[#F5F5F5] rounded-full h-14 w-14 flex items-center justify-center">
                            <Image
                                src="/assets/SVG/icons/secure.svg"
                                alt="Secure Checkout"
                                width={36}
                                height={36}
                                className="object-contain"
                            />
                        </div>
                        <p className="leading-tight">
                            Secure <br /> Checkout
                        </p>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                        <div className="bg-[#F5F5F5] rounded-full h-14 w-14 flex items-center justify-center">
                            <Image
                                src="/assets/SVG/icons/exchange.svg"
                                alt="Easy return & exchanges"
                                width={36}
                                height={36}
                                className="object-contain"
                            />
                        </div>
                        <p className="leading-tight">
                            Easy return & <br /> exchanges
                        </p>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                        <div className="bg-[#F5F5F5] rounded-full h-14 w-14 flex items-center justify-center">
                            <Image
                                src="/assets/SVG/icons/shipping.svg"
                                alt="Free shipping"
                                width={36}
                                height={36}
                                className="object-contain"
                            />
                        </div>
                        <p className="leading-tight">
                            Free <br /> shipping
                        </p>
                    </div>
                    <br />
                </div>


            </div>
        </div>
    )
}
export default CartComponent