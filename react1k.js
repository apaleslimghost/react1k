exports.h = (tagName, props = {}, ...children) => ({tagName, props, children})

let mount = (el, host, index) => {
	if(typeof el === 'string') return document.createTextNode(el)
	if(typeof el.tagName === 'string') return Object.assign(document.createElement(el.tagName), el.props)
	if(typeof el.tagName === 'function') {
		el.setProps = nextProps => render(run(Object.assign(el.props, nextProps)), host, index)
		let run = props => mount(el.tagName(props, el.setProps), host, index)
		let node = run(Object.assign({children: el.children}, el.props))
		if(el.tagName.willMount) el.tagName.willMount(el, node)
		return node
	}
}

let render = exports.render = (el, host, index = 0) => {
	let extantChild = host.childNodes[index]
	let node = mount(el, host, index)
	el.children && el.children.forEach((child, i) => child && render(child, extantChild || node, i))
	if(!extantChild) return host.appendChild(node)
	if(el.tagName.toUpperCase() === extantChild.tagName) return Object.assign(extantChild, el.props)
	extantChild.replaceWith(node)
}
