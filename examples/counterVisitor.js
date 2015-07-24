import protagonist from 'protagonist';
import fs from 'fs';
import {Visitor, makeASTVisitable} from '../lib/index';

/**
 * Here's a simple visitor that counts Resources, Requests and responses
 * in an API-Blueprint file.
 * @class
 */
class CounterVisitor extends Visitor {
  constructor() {
    this.resources = 0;
    this.requests = 0;
    this.responses = 0;
  }

   // Each `visit` method is called when the visitor visits the corresponding node.

  visitResource(/*node, ctx*/) {
    this.resources++;
  }

  visitRequest(/*node, ctx*/) {
    this.requests++;
  }

  visitResponse(/*node, ctx*/) {
    this.responses++;
  }

  // Once all the AST has been traversed, `postVisit` is called.
  postVisit() {
    console.log(this.resources);
    console.log(this.requests);
    console.log(this.responses);
  }
}

fs.readFile('blueprint.md', 'utf8', function (err, data) {
    protagonist.parse(data, function(error, result) {
      let ast = result.ast,
        myVisitor = new CounterVisitor();

      makeASTVisitable(ast);

      // Now the AST has an `accept` method:
      ast.accept(myVisitor);
    });
});
