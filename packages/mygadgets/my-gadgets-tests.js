// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by my-gadgets.js.
import { name as packageName } from "meteor/jspoet:my-gadgets";

// Write your tests here!
// Here is an example.
Tinytest.add('my-gadgets - example', function (test) {
  test.equal(packageName, "my-gadgets");
});
