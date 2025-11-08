import Image from 'next/image';

export default function CheckoutComponent() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT: Form Section */}
            <div className="space-y-8">
                <div className="border border-[#D9D9D9] p-6 rounded-md space-y-8">
                    {/* Contact Info */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                            <h2 className="text-xl font-semibold">Contact</h2>
                            <button className="text-sm text-[#D6A680] underline">Login</button>
                        </div>
                        <input
                            type="email"
                            className="w-full border border-[#D9D9D9] rounded px-3 py-2"
                            placeholder="Email"
                        />
                        <label className="flex items-center text-sm gap-2">
                            <input type="checkbox" /> Email me with news and offers
                        </label>
                    </div>

                    {/* Delivery Info */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Delivery</h2>
                        <select className="w-full border border-[#D9D9D9] rounded px-3 py-2">
                            <option>Country</option>
                        </select>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                className="flex-1 border border-[#D9D9D9] rounded px-3 py-2"
                                placeholder="First name"
                            />
                            <input
                                className="flex-1 border border-[#D9D9D9] rounded px-3 py-2"
                                placeholder="Last name"
                            />
                        </div>
                        <input
                            className="w-full border border-[#D9D9D9] rounded px-3 py-2"
                            placeholder="Address"
                        />
                        <input
                            className="w-full border border-[#D9D9D9] rounded px-3 py-2"
                            placeholder="Apartment, suite, etc (optional)"
                        />
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                className="flex-1 border border-[#D9D9D9] rounded px-3 py-2"
                                placeholder="City"
                            />
                            <input
                                className="flex-1 border border-[#D9D9D9] rounded px-3 py-2"
                                placeholder="State"
                            />
                            <input
                                className="flex-1 border border-[#D9D9D9] rounded px-3 py-2"
                                placeholder="Zip Code"
                            />
                        </div>
                        <input
                            className="w-full border border-[#D9D9D9] rounded px-3 py-2"
                            placeholder="Phone"
                        />
                    </div>
                </div>

                {/* Express Checkout */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Express checkout</h2>
                    <p className="text-sm text-gray-700 mb-4 font-advent">
                        By continuing with your payment, you agree to the future charges listed on this page and the
                        cancellation policy.
                    </p>
                    <Image
                        src='/assets/images/paypal.png'
                        alt='paypal'
                        width={180}
                        height={50}
                        className="cursor-pointer"
                    />
                </div>

                {/* Payment Section */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Payment</h2>
                    <p className="text-sm text-gray-500 mb-2">All transactions are secure and encrypted.</p>

                    {/* Credit Card Header */}
                    <div className="flex items-center justify-between flex-wrap mb-2 gap-2">
                        <span className="font-bold text-base">Credit Card</span>
                        <Image
                            src="/assets/SVG/icons/creditCards.svg"
                            alt="credit-cards"
                            width={180}
                            height={80}
                            className="cursor-pointer"
                        />
                    </div>

                    <div className="me-2 p-4 space-y-3 rounded-md border border-[#D9D9D9]">
                        <input
                            className="w-full border border-[#D9D9D9] p-2"
                            placeholder="Card number"
                        />
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                className="flex-1 border border-[#D9D9D9] p-2"
                                placeholder="Expiration date (MM/YY)"
                            />
                            <input
                                className="flex-1 border border-[#D9D9D9] p-2"
                                placeholder="Security code"
                            />
                        </div>
                        <input
                            className="w-full border border-[#D9D9D9] p-2"
                            placeholder="Name on card"
                        />
                        <label className="flex items-center text-sm mt-1">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            Use shipping address as billing address
                        </label>
                    </div>
                </div>

                <button className="bg-black rounded-md text-white py-3 px-6 w-full mt-4">CHECKOUT</button>
                <p className="text-xs text-gray-500">*See our Rental Agreement for details.</p>
            </div>

            {/* RIGHT: Summary Section */}
            <div className="space-y-6">
                <div className="border border-[#D9D9D9] rounded-md p-4 space-y-6">
                    {/* Rental Timeline */}
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Image
                                src="/assets/SVG/icons/cart.svg"
                                alt="Cart Icon"
                                width={20}
                                height={20}
                                className="object-contain"
                            />
                            <h2 className="text-lg font-semibold">Rental Timeline Highlights</h2>
                        </div>
                        <ul className="text-sm list-disc pl-5 text-gray-600 space-y-1">
                            <li>Jul 14: Delivery Day</li>
                            <li>Jul 24: YOUR EVENT DAY</li>
                            <li>Jul 29: Last day to return without fees</li>
                        </ul>
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-4">
                        {[
                            { name: 'Peak Lapel Tuxedo Jacket', size: '44 / XL', price: 119, image: '/assets/images/image-05.jpg' },
                            { name: 'Blue Tuxedo Pants - Slim', size: '36 / 40', price: 49, image: '/assets/images/image-06.jpg' },
                            { name: 'Rental damage waiver', size: '', price: 12 },
                            { name: 'Rental Agreement', size: '', price: 0 },
                        ].map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start gap-4">
                                <div className="flex gap-3">
                                    {item.image && (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={60}
                                            height={80}
                                            className="rounded object-cover border border-gray-200"
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium text-sm">{item.name}</p>
                                        {item.size && <p className="text-xs text-gray-500">Rent / {item.size}</p>}
                                    </div>
                                </div>
                                <p className="text-sm font-semibold whitespace-nowrap">${item.price.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Discount */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <input placeholder="Discount code or gift card" className="flex-1 border border-[#D9D9D9] p-2 rounded" />
                    <button className="bg-black text-white px-4 py-2 text-sm rounded">APPLY</button>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-semibold">Need more time to return?</label>
                        <p className="text-sm text-gray-600">(you can change this selection later in cart)</p>
                        <br />
                        <label className="text-sm text-gray-600">Rental Extension</label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2">
                            <select className="flex-1 border border-[#D9D9D9] p-2 text-sm rounded w-full sm:w-auto">
                                <option>Select days</option>
                            </select>
                            <button className="bg-black text-white rounded-sm px-4 py-2 text-sm">ADD</button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-6">
                        <Image
                            src="/assets/SVG/icons/copy.svg"
                            alt="Order Summary Icon"
                            width={20}
                            height={20}
                            className="object-contain"
                        />
                        <label className="text-lg font-semibold">Order Summary</label>
                    </div>

                    <div className="pt-4 space-y-2 text-sm">
                        <div className="flex text-xl justify-between font-bold">
                            <span>Subtotal - 4 items</span>
                            <span>$181.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping (Standard):</span>
                            <span>$10.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Estimated taxes</span>
                            <span>$1.17</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold border-t border-[#D9D9D9] pt-2">
                            <span>Total Payable Amount</span>
                            <span>$192.17</span>
                        </div>
                        <p className="text-xs text-gray-400">*If rental not returned $550.00</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
