'use client';
import Breadcrumb from "@/components/breadcrumb"
import CartComponent from "@/components/cart"
import Footer from "@/components/footer"
import Header from "@/components/header"
import { CartItem } from "@/interfaces/cart.interface";
import { useRouter } from "next/navigation";
import { useState } from "react";

const initialCart: CartItem[] = [
    {
        id: 1,
        name: 'Peak Lapel Tuxedo Jacket',
        size: '44 / XL',
        price: 119,
        quantity: 1,
        image: '/assets/images/image-05.jpg'
    },
    {
        id: 2,
        name: 'Blue Tuxedo Pants – Slim',
        size: '36 / 40',
        price: 49,
        quantity: 1,
        image: '/assets/images/image-06.jpg'
    },
]

const CartPage: React.FC = () => {
    const router = useRouter();
    const [cartItems, setCartItems] = useState(initialCart)
    const [eventDate, setEventDate] = useState('Jul.24, 2025')
    const updateQuantity = (id: number, delta: number) => {
        setCartItems(items =>
            items.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        )
    }

    const removeItem = (id: number) => {
        setCartItems(items => items.filter(item => item.id !== id))
    }

    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = 10
    const payable = cartTotal + shipping
    const remainingForFreeShipping = Math.max(0, 209 - cartTotal)
    return <>
        <div>
            <Header />
        </div>
        <Breadcrumb />
        <CartComponent 
            cartItems={cartItems}
            eventDate={eventDate}
            payable={payable}
            remainingForFreeShipping={remainingForFreeShipping}
            removeItem={removeItem}
            setEventDate={setEventDate}
            updateQuantity={updateQuantity}
            cartTotal={cartTotal}
            shipping={shipping}
            key="001"
            router={router}
        />
        <Footer />
    </>
};

export default CartPage;