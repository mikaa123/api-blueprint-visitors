/**
 * Create an accept function for the given node.
 * @private
 * @param  {string} type
 * @param  {object} node
 * @param  {Array<string>} childrenName
 */
function _createAccept(type, node, childrenName) {
	return function (visitor, ctx) {
		ctx = JSON.parse(JSON.stringify(ctx));
		ctx && (ctx[type.toLowerCase()] = node);

		this.nodeType = type;
		visitor.visit(this, ctx);

		childrenName && childrenName.forEach(function (childName) {
			this[childName] && this[childName].forEach(function (c) {
				c.accept(visitor, ctx);
			});
		}.bind(this));
	};
}

/**
 * Make protagonist's AST visitable, so that it can be traversed with
 * our visitors. This function decorates the ast with `accept` methods.
 * @param  {object} ast - Protagnist AST
 */
export function makeASTVisitable(ast) {
	ast.accept = (visitor) => ast.resourceGroups.accept(visitor);

	ast.resourceGroups.accept = function (visitor) {
		this.nodeType = 'Root';
		visitor.visit(this);

		ast.resourceGroups.forEach(function (group) {
			group.accept(visitor);
		});

		visitor.postVisit();
	};

	ast.resourceGroups.forEach(function (group) {
		group.accept = function (visitor) {
			var ctx = { group: group.name };

			this.nodeType = 'Group';
			visitor.visit(this, ctx);

			this.resources && this.resources.forEach(function (r) {
				r.accept(visitor, ctx);
			});
		};

		group.resources.forEach(function (resource) {
			resource.accept = _createAccept('Resource', resource, ['actions']);

			resource.actions.forEach(function (action) {
				action.accept = _createAccept('Action', action, ['examples']);

				action.examples.forEach(function (example) {
					example.accept = _createAccept('Example', example, ['requests', 'responses']);

					example.requests.forEach(function (r) {
						r.accept = _createAccept('Request', r);
					});

					example.responses.forEach(function (r) {
						r.accept = _createAccept('Response', r);
					});
				});
			});
		});
	});
}

/**
 * A Visitor base class that knows how to visit ASTs decorated with `makeASTVisitable`.
 * This class is meant to be extended.
 * @class
 */
export class Visitor {

	/**
	 * Call your visitor's methods.
	 * This is where the double-dispatch takes place. For instance, if your visitor
	 * implements a `visitResource` method, then this method will call it when a
	 * resource is being visited.
	 * @param  {object} node - The node being visited
	 * @param  {object} ctx  - The parent nodes
	 */
	visit(node, ctx) {
		try {
			this['visit' + node.nodeType](node, ctx);
		} catch (e) {
			// Do nothing if the method isn't implemented
		}
	}

	/**
	 * Post-traversal hook. Will be called when all nodes have been visited.
	 */
	postVisit() {
		// Override in subclasses
	}
}
