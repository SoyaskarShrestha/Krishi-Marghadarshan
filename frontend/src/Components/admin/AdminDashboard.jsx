import { useEffect, useMemo, useRef, useState } from 'react'
import NavBar from '../layout/NavBar'
import './AdminDashboard.css'
import { API_ENDPOINTS, apiRequest } from '../../lib/api'

const emptyProduct = {
	name: '',
	category: '',
	price: '',
	description: '',
	badge: '',
	badge_tone: '',
}

const emptyArticle = {
	title: '',
	title_nepali: '',
	category: '',
	description: '',
	badge: '',
	read_time: '',
	published_label: '',
	featured: false,
}

function AdminDashboard() {
	const [products, setProducts] = useState([])
	const [articles, setArticles] = useState([])
	const [activityLog, setActivityLog] = useState([])
	const [productForm, setProductForm] = useState(emptyProduct)
	const [articleForm, setArticleForm] = useState(emptyArticle)
	const [productPhoto, setProductPhoto] = useState(null)
	const [articlePhoto, setArticlePhoto] = useState(null)
	const [editingProductId, setEditingProductId] = useState(null)
	const [editingArticleId, setEditingArticleId] = useState(null)
	const [notification, setNotification] = useState(null)
	const [pendingDelete, setPendingDelete] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const notificationTimer = useRef(null)

	const sortedProducts = useMemo(() => [...products].sort((a, b) => a.id - b.id), [products])
	const sortedArticles = useMemo(() => [...articles].sort((a, b) => a.id - b.id), [articles])

	const showNotification = (type, message) => {
		if (notificationTimer.current) {
			window.clearTimeout(notificationTimer.current)
		}

		setNotification({ type, message })
		notificationTimer.current = window.setTimeout(() => {
			setNotification(null)
			notificationTimer.current = null
		}, 3000)
	}

	const loadData = async () => {
		setIsLoading(true)
		try {
			const [productPayload, articlePayload, activityPayload] = await Promise.all([
				apiRequest(API_ENDPOINTS.SHOP_PRODUCTS),
				apiRequest(API_ENDPOINTS.ARTICLES),
				apiRequest(API_ENDPOINTS.AUTH_ADMIN_ACTIVITY),
			])
			setProducts(Array.isArray(productPayload) ? productPayload : [])
			setArticles(Array.isArray(articlePayload) ? articlePayload : [])
			setActivityLog(Array.isArray(activityPayload) ? activityPayload : [])
		} catch (error) {
			showNotification('error', error.message || 'Unable to load admin data.')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		loadData()

		return () => {
			if (notificationTimer.current) {
				window.clearTimeout(notificationTimer.current)
			}
		}
	}, [])

	const onProductInput = (event) => {
		const { name, value } = event.target
		setProductForm((current) => ({ ...current, [name]: value }))
	}

	const onProductPhotoChange = (event) => {
		setProductPhoto(event.target.files?.[0] || null)
	}

	const onArticleInput = (event) => {
		const { name, value, type, checked } = event.target
		setArticleForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
	}

	const onArticlePhotoChange = (event) => {
		setArticlePhoto(event.target.files?.[0] || null)
	}

	const resetProductForm = () => {
		setEditingProductId(null)
		setProductForm(emptyProduct)
		setProductPhoto(null)
	}

	const resetArticleForm = () => {
		setEditingArticleId(null)
		setArticleForm(emptyArticle)
		setArticlePhoto(null)
	}

	const saveProduct = async (event) => {
		event.preventDefault()
		try {
			const payload = new FormData()
			payload.append('name', productForm.name)
			payload.append('category', productForm.category)
			payload.append('price', String(Number(productForm.price || 0)))
			payload.append('description', productForm.description)
			payload.append('badge', productForm.badge)
			payload.append('badge_tone', productForm.badge_tone)
			if (productPhoto) {
				payload.append('photo', productPhoto)
			}
			if (editingProductId) {
				await apiRequest(`${API_ENDPOINTS.SHOP_PRODUCTS}${editingProductId}/`, {
					method: 'PATCH',
					body: payload,
				})
				showNotification('success', 'Product updated.')
			} else {
				await apiRequest(API_ENDPOINTS.SHOP_PRODUCTS, {
					method: 'POST',
					body: payload,
				})
				showNotification('success', 'Product created.')
			}
			resetProductForm()
			loadData()
		} catch (error) {
			showNotification('error', error.message || 'Unable to save product.')
		}
	}

	const saveArticle = async (event) => {
		event.preventDefault()
		try {
			const payload = new FormData()
			payload.append('title', articleForm.title)
			payload.append('title_nepali', articleForm.title_nepali)
			payload.append('category', articleForm.category)
			payload.append('description', articleForm.description)
			payload.append('badge', articleForm.badge)
			payload.append('read_time', articleForm.read_time)
			payload.append('published_label', articleForm.published_label)
			payload.append('featured', articleForm.featured ? 'true' : 'false')
			if (articlePhoto) {
				payload.append('photo', articlePhoto)
			}
			if (editingArticleId) {
				await apiRequest(`${API_ENDPOINTS.ARTICLES}${editingArticleId}/`, {
					method: 'PATCH',
					body: payload,
				})
				showNotification('success', 'Article updated.')
			} else {
				await apiRequest(API_ENDPOINTS.ARTICLES, {
					method: 'POST',
					body: payload,
				})
				showNotification('success', 'Article created.')
			}
			resetArticleForm()
			loadData()
		} catch (error) {
			showNotification('error', error.message || 'Unable to save article.')
		}
	}

	const editProduct = (product) => {
		setEditingProductId(product.id)
		setProductForm({
			name: product.name || '',
			category: product.category || '',
			price: product.price || '',
			description: product.description || '',
			badge: product.badge || '',
			badge_tone: product.badge_tone || '',
		})
		setProductPhoto(null)
	}

	const editArticle = (article) => {
		setEditingArticleId(article.id)
		setArticleForm({
			title: article.title || '',
			title_nepali: article.title_nepali || '',
			category: article.category || '',
			description: article.description || '',
			badge: article.badge || '',
			read_time: article.read_time || '',
			published_label: article.published_label || '',
			featured: Boolean(article.featured),
		})
		setArticlePhoto(null)
	}

	const deleteProduct = async (id) => {
		try {
			await apiRequest(`${API_ENDPOINTS.SHOP_PRODUCTS}${id}/`, { method: 'DELETE' })
			showNotification('success', 'Product deleted.')
			loadData()
		} catch (error) {
			showNotification('error', error.message || 'Unable to delete product.')
		}
		setPendingDelete(null)
	}

	const deleteArticle = async (id) => {
		try {
			await apiRequest(`${API_ENDPOINTS.ARTICLES}${id}/`, { method: 'DELETE' })
			showNotification('success', 'Article deleted.')
			loadData()
		} catch (error) {
			showNotification('error', error.message || 'Unable to delete article.')
		}
		setPendingDelete(null)
	}

	const confirmDelete = async () => {
		if (!pendingDelete) {
			return
		}

		if (pendingDelete.type === 'product') {
			await deleteProduct(pendingDelete.id)
			return
		}

		await deleteArticle(pendingDelete.id)
	}

	return (
		<div className="admin-page">
			<NavBar />
			<main className="admin-main">
				<div className="admin-shell">
				<div className="admin-header">
					<div>
						<h2>Admin Dashboard</h2>
						<p>Manage products and articles shown in the application.</p>
					</div>
					<button type="button" className="admin-secondary" onClick={loadData} disabled={isLoading}>
						Refresh data
					</button>
				</div>
				{notification ? <div className={`admin-toast admin-toast-${notification.type}`}>{notification.message}</div> : null}
				{isLoading ? <p>Loading data...</p> : null}

				<section className="admin-grid">
					<article className="admin-card">
						<h3>{editingProductId ? 'Edit Product' : 'Add Product'}</h3>
						<form onSubmit={saveProduct} className="admin-form">
							<input name="name" value={productForm.name} onChange={onProductInput} placeholder="Name" required />
							<input name="category" value={productForm.category} onChange={onProductInput} placeholder="Category" required />
							<input name="price" type="number" step="0.01" value={productForm.price} onChange={onProductInput} placeholder="Price" required />
							<textarea name="description" value={productForm.description} onChange={onProductInput} placeholder="Description" required />
							<input name="badge" value={productForm.badge} onChange={onProductInput} placeholder="Badge" />
							<input name="badge_tone" value={productForm.badge_tone} onChange={onProductInput} placeholder="Badge tone" />
							<label className="admin-file-input">
								<span>Product image</span>
								<input name="photo" type="file" accept="image/*" onChange={onProductPhotoChange} />
							</label>
							{productPhoto ? <p className="admin-file-hint">Selected file: {productPhoto.name}</p> : null}
							<div className="admin-actions">
								<button type="submit">{editingProductId ? 'Update Product' : 'Create Product'}</button>
								{editingProductId ? (
									<button type="button" onClick={resetProductForm}>
										Cancel
									</button>
								) : null}
							</div>
						</form>
					</article>

					<article className="admin-card">
						<h3>{editingArticleId ? 'Edit Article' : 'Add Article'}</h3>
						<form onSubmit={saveArticle} className="admin-form">
							<input name="title" value={articleForm.title} onChange={onArticleInput} placeholder="Title" required />
							<input name="title_nepali" value={articleForm.title_nepali} onChange={onArticleInput} placeholder="Title Nepali" />
							<input name="category" value={articleForm.category} onChange={onArticleInput} placeholder="Category" required />
							<textarea name="description" value={articleForm.description} onChange={onArticleInput} placeholder="Description" required />
							<input name="badge" value={articleForm.badge} onChange={onArticleInput} placeholder="Badge" />
							<input name="read_time" value={articleForm.read_time} onChange={onArticleInput} placeholder="Read time" />
							<input name="published_label" value={articleForm.published_label} onChange={onArticleInput} placeholder="Published label" />
							<label className="admin-file-input">
								<span>Article image</span>
								<input name="photo" type="file" accept="image/*" onChange={onArticlePhotoChange} />
							</label>
							{articlePhoto ? <p className="admin-file-hint">Selected file: {articlePhoto.name}</p> : null}
							<label className="admin-checkbox-row">
								<span>Featured</span>
								<input name="featured" type="checkbox" checked={articleForm.featured} onChange={onArticleInput} />
							</label>
							<div className="admin-actions">
								<button type="submit">{editingArticleId ? 'Update Article' : 'Create Article'}</button>
								{editingArticleId ? (
									<button type="button" onClick={resetArticleForm}>
										Cancel
									</button>
								) : null}
							</div>
						</form>
					</article>
				</section>

				<section className="admin-list-grid">
					<article className="admin-card">
						<h3>Products ({sortedProducts.length})</h3>
						<div className="admin-list">
							{sortedProducts.map((product) => (
								<div key={product.id} className="admin-list-item">
									<div>
										<strong>{product.name}</strong>
										<p>{product.category} • Rs. {product.price}</p>
										<p>{product.photo ? 'Image attached' : 'No image attached'}</p>
									</div>
									<div className="admin-actions">
										<button type="button" onClick={() => editProduct(product)}>Edit</button>
										<button type="button" onClick={() => setPendingDelete({ type: 'product', id: product.id, label: product.name })}>Delete</button>
									</div>
								</div>
							))}
						</div>
					</article>

					<article className="admin-card">
						<h3>Articles ({sortedArticles.length})</h3>
						<div className="admin-list">
							{sortedArticles.map((article) => (
								<div key={article.id} className="admin-list-item">
									<div>
										<strong>{article.title}</strong>
										<p>{article.category} {article.featured ? '• Featured' : ''}</p>
										<p>{article.photo ? 'Image attached' : 'No image attached'}</p>
									</div>
									<div className="admin-actions">
										<button type="button" onClick={() => editArticle(article)}>Edit</button>
										<button type="button" onClick={() => setPendingDelete({ type: 'article', id: article.id, label: article.title })}>Delete</button>
									</div>
								</div>
							))}
						</div>
					</article>
				</section>

				<section className="admin-card admin-log-card">
					<h3>Activity Log</h3>
					<div className="admin-log-list">
						{activityLog.length ? (
							activityLog.map((entry) => (
								<div key={entry.id} className="admin-log-item">
									<div>
										<strong>{entry.summary}</strong>
										<p>{entry.actor_email || 'System'} • {entry.action} • {entry.target_type}</p>
									</div>
									<time dateTime={entry.created_at}>{new Date(entry.created_at).toLocaleString()}</time>
								</div>
							))
						) : (
							<p className="admin-log-empty">No admin actions recorded yet.</p>
						)}
					</div>
				</section>

				{pendingDelete ? (
					<div className="admin-modal-backdrop" role="presentation" onClick={() => setPendingDelete(null)}>
						<div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="delete-title" onClick={(event) => event.stopPropagation()}>
							<h3 id="delete-title">Delete {pendingDelete.type === 'product' ? 'product' : 'article'}?</h3>
							<p>
								This will permanently remove <strong>{pendingDelete.label}</strong>.
							</p>
							<div className="admin-actions">
								<button type="button" className="admin-danger" onClick={confirmDelete}>
									Delete
								</button>
								<button type="button" className="admin-secondary" onClick={() => setPendingDelete(null)}>
									Cancel
								</button>
							</div>
						</div>
					</div>
				) : null}
				</div>
			</main>
		</div>
	)
}

export default AdminDashboard
