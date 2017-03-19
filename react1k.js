exports.h = (tagName, props = {}, ...children) => ({tagName, props, children})

const string = Symbol('string')

let createNode = ({tagName, props, data}) =>
	tagName === string ? document.createTextNode(data)
	: Object.assign(document.createElement(tagName), props)

let modifyElement = (el, host, index) => {
	if(typeof el === 'string') return {tagName: string, data: el, children: []}
	if(typeof el.tagName === 'function') {
		el.setProps = nextProps => render(run(Object.assign(el.props, nextProps)), host, index);
		let run = props => modifyElement(el.tagName(props, el.setProps), host, index);
		return run(Object.assign({children: el.children}, el.props))
	}
	return el;
}

let render = exports.render = (origEl, host, index = 0) => {
	let el = modifyElement(origEl, host, index)
	let extantChild = host.childNodes[index]
	let node = createNode(el)
	if(origEl.tagName && origEl.tagName.willMount) origEl.tagName.willMount.call(origEl, node);
	el.children.forEach((child, i) => child && render(child, extantChild || node, i))
	if(!extantChild) return host.appendChild(node)
	if(el.tagName.toUpperCase() === extantChild.tagName) return Object.assign(extantChild, el.props)
	extantChild.replaceWith(node)
}
