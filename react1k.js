exports.h = (tagName, props = {}, ...children) => ({tagName, props, children})

let createNode = ({tagName, props, data}) =>
	tagName === '_string' ? document.createTextNode(data)
	: Object.assign(document.createElement(tagName), props)

let modifyElement = (el, host, index) => {
	if(typeof el === 'string') return {tagName: '_string', data: el, children: []}
	if(typeof el.tagName === 'function') {
		let run = props => modifyElement(el.tagName(props, nextProps => render(run(Object.assign(el.props, nextProps)), host, index)));
		return run(Object.assign({children: el.children}, el.props))
	}
}

let render = exports.render = (el, host, index = 0) => {
	el = modifyElement(el, host, index) || el
	let extantChild = host.childNodes[index]
	let node = createNode(el)
	el.children.forEach((child, i) => child && render(child, extantChild || node, i))
	if(!extantChild) return host.append(node)
	if(el.tagName.toUpperCase() === extantChild.tagName) return Object.assign(extantChild, el.props)
	extantChild.replaceWith(node)
}