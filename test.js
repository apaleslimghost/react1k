/** @jsx h */

const {expect} = require('chai')
	.use(require('sinon-chai'))
	.use(require('@quarterto/chai-dom-equal'))
	.use(require('dirty-chai'));

const {spy} = require('sinon');

const promisify = require('@quarterto/promisify');
const jsdom = promisify(require('jsdom').env);
const {h, render} = require('./');

describe('react1k', () => {
	let main;

	before(async () => {
		const {document} = await jsdom('<main></main>');
		Object.assign(global, {document});
		main = document.querySelector('main');
	});

	beforeEach(() => {
		main.innerHTML = '';
	});

	describe('basic rendering', () => {
		it('should render basic elements', () => {
			render(<div/>, main);
			expect(main.innerHTML).dom.to.equal('<div></div>');
		});

		it('should render elements with text children', () => {
			render(<div>it works</div>, main);
			expect(main.innerHTML).dom.to.equal('<div>it works</div>');
		});

		it('should render nested elements', () => {
			render(<div><div>it works</div></div>, main);
			expect(main.innerHTML).dom.to.equal('<div><div>it works</div></div>');
		});

		it('should render sibling elements', () => {
			render(<div><div>it</div><div>works</div></div>, main);
			expect(main.innerHTML).dom.to.equal('<div><div>it</div><div>works</div></div>');
		});

		it('should do attributes ', () => {
			render(<div id='bar'/>, main);
			expect(main.innerHTML).dom.to.equal('<div id="bar"></div>');
		});

		it('should preserve elements when rerendering if it looks the same', () => {
			render(<div/>, main);
			const div = document.querySelector('main > div');
			render(<div/>, main);
			expect(div).to.equal(document.querySelector('main > div'));
		});

		it('should update attributes when rerendering', () => {
			render(<div id='bar'/>, main);
			render(<div id='baz'/>, main);
			expect(main.innerHTML).dom.to.equal('<div id="baz"></div>');
		});
	});

	it('should call willMount on a parent of a direct child', () => {
		const Foo = () => <div />;
		const Bar = () => <Foo />;

		Foo.willMount = spy();
		Bar.willMount = spy();

		render(<Bar />, main);

		expect(Foo.willMount).to.have.been.called();
		expect(Bar.willMount).to.have.been.called();
	});
});
