/** @jsx h */

const {expect} = require('chai')
	.use(require('sinon-chai'))
	.use(require('dirty-chai'));

const {spy} = require('sinon');

const promisify = require('@quarterto/promisify');
const jsdom = promisify(require('jsdom').env);
const {h, render} = require('./');

describe('react1k', () => {
	before(async () => {
		const {document} = await jsdom('<main></main>');
		Object.assign(global, {document});
	});

	it('should call willMount on a parent of a direct child', () => {
		const Foo = () => <div />;
		const Bar = () => <Foo />;

		Foo.willMount = spy();
		Bar.willMount = spy();

		const main = document.querySelector('main');
		render(<Bar />, main);

		expect(Foo.willMount).to.have.been.called();
		expect(Bar.willMount).to.have.been.called();
	});
});
