import './Cart.css'
import NavBar from './NavBar'
import productImage1 from '../assets/homepage/product-1.jpg'
import productImage2 from '../assets/homepage/product-2.jpg'
import productImage3 from '../assets/homepage/product-3.jpg'

const cartItems = [
	{
		name: 'Organic Rice Seeds',
		variant: '25 kg certified pack',
		price: 500,
		quantity: 1,
		image: productImage1,
	},
	{
		name: 'Precision Trowel',
		variant: 'Stainless steel with bamboo grip',
		price: 1250,
		quantity: 1,
		image: productImage2,
	},
	{
		name: 'Bio-Root Nutrient',
		variant: 'Liquid soil booster - 1 litre',
		price: 890,
		quantity: 2,
		image: productImage3,
	},
]

const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
const deliveryFee = 120
const serviceFee = 80
const total = subtotal + deliveryFee + serviceFee

function MinusIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="cart-icon-svg">
			<path d="M6 12h12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		</svg>
	)
}

function PlusIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="cart-icon-svg">
			<path d="M12 6v12M6 12h12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
		</svg>
	)
}

function ShieldIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="cart-icon-svg">
			<path
				d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Zm-3 9 2 2 4-4"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function TruckIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="cart-icon-svg">
			<path
				d="M3 7h10v8H3zM13 10h3l3 3v2h-6zM7 18a1.5 1.5 0 1 0 0 .01M17 18a1.5 1.5 0 1 0 0 .01"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

function Cart() {
	return (
		<div className="cart-page">
						<NavBar showCart cartCount={cartItems.length} />

			<main className="cart-shell cart-main">
				<section className="cart-hero">
					<div>
						<span className="cart-kicker">Checkout Summary</span>
						<h2>Your Cart</h2>
						<p>Review your selected supplies before proceeding to checkout.</p>
					</div>
					<div className="cart-hero-chip">
						<span>{cartItems.length} Items</span>
						<strong>Rs. {total.toLocaleString()}</strong>
					</div>
				</section>

				<section className="cart-layout">
					<div className="cart-items-panel">
						<div className="cart-section-head">
							<div>
								<span className="cart-section-label">Selected Supplies</span>
								<h3>Items ready for delivery</h3>
							</div>
						</div>

						<div className="cart-item-list">
							{cartItems.map((item) => (
								<article className="cart-item-card" key={item.name}>
									<img src={item.image} alt={item.name} className="cart-item-image" />
									<div className="cart-item-copy">
										<div className="cart-item-top">
											<div>
												<h4>{item.name}</h4>
												<p>{item.variant}</p>
											</div>
											<strong>Rs. {(item.price * item.quantity).toLocaleString()}</strong>
										</div>
										<div className="cart-item-controls">
											<div className="cart-qty-control">
												<button type="button" aria-label="Decrease quantity">
													<MinusIcon />
												</button>
												<span>{item.quantity}</span>
												<button type="button" aria-label="Increase quantity">
													<PlusIcon />
												</button>
											</div>
											<button type="button" className="cart-remove-button">
												Remove
											</button>
										</div>
									</div>
								</article>
							))}
						</div>
					</div>

					<aside className="cart-summary-panel">
						<div className="cart-section-head">
							<div>
								<span className="cart-section-label">Payment Details</span>
								<h3>Order Summary</h3>
							</div>
						</div>

						<div className="cart-summary-list">
							<div>
								<span>Subtotal</span>
								<strong>Rs. {subtotal.toLocaleString()}</strong>
							</div>
							<div>
								<span>Delivery</span>
								<strong>Rs. {deliveryFee.toLocaleString()}</strong>
							</div>
							<div>
								<span>Service Fee</span>
								<strong>Rs. {serviceFee.toLocaleString()}</strong>
							</div>
							<div className="cart-summary-total">
								<span>Total</span>
								<strong>Rs. {total.toLocaleString()}</strong>
							</div>
						</div>

						<div className="cart-summary-badges">
							<div className="cart-badge-card">
								<span className="cart-badge-icon"><ShieldIcon /></span>
								<div>
									<strong>Secure Checkout</strong>
									<p>Your order details are protected.</p>
								</div>
							</div>
							<div className="cart-badge-card">
								<span className="cart-badge-icon"><TruckIcon /></span>
								<div>
									<strong>Fast Dispatch</strong>
									<p>Expected delivery within 2-4 days.</p>
								</div>
							</div>
						</div>

						<button type="button" className="cart-checkout-button">
							Proceed to Checkout
						</button>
						<button type="button" className="cart-secondary-button">
							Continue Shopping
						</button>
					</aside>
				</section>
			</main>
		</div>
	)
}

export default Cart






