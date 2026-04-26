import { Link } from 'react-router-dom'

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
	const safeBrand = brand || 'Krishi Margadarshan'
	const safeCopy = copy || ''
	const safeLinks = Array.isArray(links) ? links : []
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
					{safeLinks.map((item) => (
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
