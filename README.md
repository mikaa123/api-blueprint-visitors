# API Blueprint Visitor
A **[Visitor](https://en.wikipedia.org/wiki/Visitor_pattern)** base class that lets you derive your own visitors for manipulating
[API-Blueprint](https://github.com/apiaryio/api-blueprint)'s AST, so that you can build awesome tools.

## Installing
`npm install api-blueprint-visitors`

## Getting Started
Two things are provided in api-blueprint-visitors:

* A **Visitor** base class
* The `makeASTVisitable` function, that makes Protagonist's AST visitable.

Let's imagine we want to create a script that counts all the Resources, Requests
and Responses in a blueprint file.

Our visitor could look something like this:

```js
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
```

Now, in order to visit the AST, we need to make that AST visitable:

```js
fs.readFile('blueprint.md', 'utf8', function (err, data) {
    protagonist.parse(data, function(error, result) {
      let ast = result.ast,
        myVisitor = new CounterVisitor();

      makeASTVisitable(ast);

      // Now the AST has an `accept` method:
      ast.accept(myVisitor);
    });
});
```

And that's it! The visitor can visit Group, Resource, Action, Request, Response
and Example.

Check the full example [here](examples/CounterVisitor.js).

## Contributing
1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## License
MIT
