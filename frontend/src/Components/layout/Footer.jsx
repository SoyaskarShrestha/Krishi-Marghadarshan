import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Footer({
	footerClassName,
	innerClassName,
	linksClassName,
	brand,
	copy,
	brandClassName,
	copyClassName,
	links,
	wrapBrandCopy = false,
	footerProps,
	innerProps,
}) {
	const { currentUser } = useAuth()
	const safeBrand = brand || 'Krishi Margadarshan'
	const safeCopy = copy || ''
	const safeLinks = Array.isArray(links) ? links : []
	const role = currentUser?.accessRole || (currentUser?.isAdmin ? 'admin' : currentUser?.role || 'guest')
	const filteredLinks = safeLinks.filter((item) => {
		if (item?.to === '/weather' || item?.to === '/crop-prediction') {
			return role === 'farmer' || role === 'admin'
		}

		if (item?.to === '/advisory') {
			return role === 'farmer' || role === 'admin'
		}

		if (item?.to === '/advisor-panel') {
			return role === 'advisor' || role === 'admin'
		}

		if (item?.to === '/admin-dashboard') {
			return role === 'admin'
		}

		if (item?.to === '/cart' || item?.to === '/user-profile') {
			return Boolean(currentUser)
		}

		return true
	})
	const brandNode = brandClassName ? <div className={brandClassName}>{safeBrand}</div> : <strong>{safeBrand}</strong>
	const copyNode = copyClassName ? <div className={copyClassName}>{safeCopy}</div> : <p>{safeCopy}</p>

	return (
		<footer className={footerClassName} {...footerProps}>
			<div className={innerClassName} {...innerProps}>
				{wrapBrandCopy ? (
					<div>
						{brandNode}
						{copyNode}
					</div>
				) : (
					brandNode
				)}
				<div className={linksClassName}>
					{filteredLinks.map((item) => (
						<Link key={item.label} to={item.to}>
							{item.label}
						</Link>
					))}
				</div>
				{wrapBrandCopy ? null : copyNode}
			</div>
		</footer>
	)
}

export default Footer
