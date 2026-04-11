import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './Cart.css'
import NavBar from './NavBar'
import { API_ENDPOINTS, apiRequest } from '../lib/api'
import { useTranslation } from 'react-i18next'
import productImage1 from '../assets/homepage/product-1.jpg'
import productImage2 from '../assets/homepage/product-2.jpg'
import productImage3 from '../assets/homepage/product-3.jpg'

const cartImages = [productImage1, productImage2, productImage3]

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
	const { t } = useTranslation()
	const fallbackCartItems = useMemo(
		() => [
			{
				id: 'fallback-1',
				name: t('shop.fallbackProducts.0.name'),
				variant: t('cart.fallbackItems.0.variant', { defaultValue: '25 kg certified pack' }),
				price: 500,
				quantity: 1,
				image: productImage1,
			},
			{
				id: 'fallback-2',
				name: t('shop.fallbackProducts.1.name'),
				variant: t('cart.fallbackItems.1.variant', { defaultValue: 'Stainless steel with bamboo grip' }),
				price: 1250,
				quantity: 1,
				image: productImage2,
			},
			{
				id: 'fallback-3',
				name: t('shop.fallbackProducts.2.name'),
				variant: t('cart.fallbackItems.2.variant', { defaultValue: 'Liquid soil booster - 1 litre' }),
				price: 890,
				quantity: 2,
				image: productImage3,
			},
		],
		[t]
	)
	const [cartItems, setCartItems] = useState(fallbackCartItems)
	const [cartError, setCartError] = useState('')
	const [isFallbackMode, setIsFallbackMode] = useState(true)

	useEffect(() => {
		if (isFallbackMode) {
			setCartItems(fallbackCartItems)
		}
	}, [fallbackCartItems, isFallbackMode])

	useEffect(() => {
		let ignore = false

		async function loadCart() {
			try {
				const payload = await apiRequest(API_ENDPOINTS.SHOP_CART)
				if (!Array.isArray(payload) || ignore) {
					return
				}

				setCartItems(
					payload.map((item, index) => ({
						id: item.id,
						name: item.product.name,
						variant: item.product.description,
						price: Number(item.product.price || 0),
						quantity: item.quantity,
						image: cartImages[index % cartImages.length],
					}))
				)
				setIsFallbackMode(false)
				setCartError('')
			} catch {
				if (!ignore) {
					setIsFallbackMode(true)
						setCartError(t('cart.fallbackError'))
				}
			}
		}

		loadCart()

		return () => {
			ignore = true
		}
	}, [])

	const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems])
	const deliveryFee = cartItems.length ? 120 : 0
	const serviceFee = cartItems.length ? 80 : 0
	const total = subtotal + deliveryFee + serviceFee

	const syncQuantity = async (itemId, nextQuantity) => {
		if (isFallbackMode || typeof itemId !== 'number') {
			setCartItems((current) =>
				current.map((item) => (item.id === itemId ? { ...item, quantity: Math.max(1, nextQuantity) } : item))
			)
			return
		}

		try {
			const payload = await apiRequest(`${API_ENDPOINTS.SHOP_CART}${itemId}/`, {
				method: 'PATCH',
				body: JSON.stringify({ quantity: Math.max(1, nextQuantity) }),
			})
			setCartItems((current) =>
				current.map((item) => (item.id === itemId ? { ...item, quantity: payload.quantity } : item))
			)
		} catch (error) {
			setCartError(error.message)
		}
	}

	const removeItem = async (itemId) => {
		if (isFallbackMode || typeof itemId !== 'number') {
			setCartItems((current) => current.filter((item) => item.id !== itemId))
			return
		}

		try {
			await apiRequest(`${API_ENDPOINTS.SHOP_CART}${itemId}/`, { method: 'DELETE' })
			setCartItems((current) => current.filter((item) => item.id !== itemId))
		} catch (error) {
			setCartError(error.message)
		}
	}

	return (
		<div className="cart-page">
						<NavBar showCart cartCount={cartItems.length} />

			<main className="cart-shell cart-main">
				{cartError ? <p>{cartError}</p> : null}
				<section className="cart-hero">
					<div>
						<span className="cart-kicker">{t('cart.checkoutSummary')}</span>
						<h2>{t('cart.yourCart')}</h2>
						<p>{t('cart.review')}</p>
					</div>
					<div className="cart-hero-chip">
						<span>{t('cart.itemsLabel', { count: cartItems.length })}</span>
						<strong>{t('cart.currencyPrefix')} {total.toLocaleString()}</strong>
					</div>
				</section>

				<section className="cart-layout">
					<div className="cart-items-panel">
						<div className="cart-section-head">
							<div>
								<span className="cart-section-label">{t('cart.selectedSupplies')}</span>
								<h3>{t('cart.itemsReady')}</h3>
							</div>
						</div>

						<div className="cart-item-list">
							{cartItems.length === 0 ? <p>{t('cart.emptyCart')}</p> : null}
							{cartItems.map((item) => (
								<article className="cart-item-card" key={item.name}>
									<img src={item.image} alt={item.name} className="cart-item-image" />
									<div className="cart-item-copy">
										<div className="cart-item-top">
											<div>
												<h4>{item.name}</h4>
												<p>{item.variant}</p>
											</div>
											<strong>{t('cart.currencyPrefix')} {(item.price * item.quantity).toLocaleString()}</strong>
										</div>
										<div className="cart-item-controls">
											<div className="cart-qty-control">
												<button type="button" aria-label={t('cart.decreaseQuantity')} onClick={() => syncQuantity(item.id, item.quantity - 1)}>
													<MinusIcon />
												</button>
												<span>{item.quantity}</span>
												<button type="button" aria-label={t('cart.increaseQuantity')} onClick={() => syncQuantity(item.id, item.quantity + 1)}>
													<PlusIcon />
												</button>
											</div>
											<button type="button" className="cart-remove-button" onClick={() => removeItem(item.id)}>
												{t('cart.remove')}
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
								<span className="cart-section-label">{t('cart.paymentDetails')}</span>
								<h3>{t('cart.orderSummary')}</h3>
							</div>
						</div>

						<div className="cart-summary-list">
							<div>
								<span>{t('cart.subtotal')}</span>
								<strong>{t('cart.currencyPrefix')} {subtotal.toLocaleString()}</strong>
							</div>
							<div>
								<span>{t('cart.delivery')}</span>
								<strong>{t('cart.currencyPrefix')} {deliveryFee.toLocaleString()}</strong>
							</div>
							<div>
								<span>{t('cart.serviceFee')}</span>
								<strong>{t('cart.currencyPrefix')} {serviceFee.toLocaleString()}</strong>
							</div>
							<div className="cart-summary-total">
								<span>{t('cart.total')}</span>
								<strong>{t('cart.currencyPrefix')} {total.toLocaleString()}</strong>
							</div>
						</div>

						<div className="cart-summary-badges">
							<div className="cart-badge-card">
								<span className="cart-badge-icon"><ShieldIcon /></span>
								<div>
									<strong>{t('cart.secureCheckout')}</strong>
									<p>{t('cart.orderProtected')}</p>
								</div>
							</div>
							<div className="cart-badge-card">
								<span className="cart-badge-icon"><TruckIcon /></span>
								<div>
									<strong>{t('cart.fastDispatch')}</strong>
									<p>{t('cart.deliveryWindow')}</p>
								</div>
							</div>
						</div>

						<button type="button" className="cart-checkout-button">
							{t('cart.proceedToCheckout')}
						</button>
						<Link to="/shop" className="cart-secondary-button">
							{t('cart.continueShopping')}
						</Link>
					</aside>
				</section>
			</main>
		</div>
	)
}

export default Cart






