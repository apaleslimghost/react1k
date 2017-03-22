exports.h = (type, props = {}, ...children) => ({type, props, children})

let mount = (el, host, index) => {
	if(typeof el === 'string') return document.createTextNode(el)
	if(typeof el.type === 'string') return Object.assign(document.createElement(el.type), el.props)
	if(typeof el.type === 'function') {
		el.setProps = nextProps => render(Object.assign(el, {props: Object.assign(el.props, nextProps)}), host, index)
		let props = Object.assign({children: el.children}, el.props)
		let node = mount(el.type(props, el.setProps), host, index)
		if(el.type.willMount) el.type.willMount(el, node)
		return node
	}
}

let render = exports.render = (el, host, index = 0) => {
	let current = host.childNodes[index]
	let node = mount(el, host, index)
	if(el.children) el.children.forEach((child, i) => child && render(child, current || node, i))
	if(!current) return host.appendChild(node)
	if(el.type === current.tagName.toLowerCase()) return Object.assign(current, el.props)
	host.replaceChild(node, current)
}
