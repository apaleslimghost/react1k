exports.h = (type, props = {}, ...children) => ({type, props, children})

let mount = (el, host, index) => {
	if(typeof el === 'string') return document.createTextNode(el)
	if(typeof el.type === 'string') return Object.assign(document.createElement(el.type), el.props)
	if(typeof el.type === 'function') {
		el.setProps = nextProps => render(run(Object.assign(el.props, nextProps)), host, index)
		let run = props => mount(el.type(props, el.setProps), host, index)
		let node = run(Object.assign({children: el.children}, el.props))
		if(el.type.willMount) el.type.willMount(el, node)
		return node
	}
}

let render = exports.render = (el, host, index = 0) => {
	let extantChild = host.childNodes[index]
	let node = mount(el, host, index)
	el.children && el.children.forEach((child, i) => child && render(child, extantChild || node, i))
	if(!extantChild) return host.appendChild(node)
	if(el.tagName.toUpperCase() === extantChild.type) return Object.assign(extantChild, el.props)
	extantChild.replaceWith(node)
}
