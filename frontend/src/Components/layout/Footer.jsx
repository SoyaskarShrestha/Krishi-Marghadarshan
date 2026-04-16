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
	const brandNode = brandClassName ? <div className={brandClassName}>{brand}</div> : <strong>{brand}</strong>
	const copyNode = copyClassName ? <div className={copyClassName}>{copy}</div> : <p>{copy}</p>

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
					{links.map((item) => (
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
