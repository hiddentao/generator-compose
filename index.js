module.exports = compose;

/**
 * Compose `middleware` returning a fully valid middleware 
 * comprised of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

module.exports = compose = function(middleware){
  /**
   * We pass all incoming arguments to each middleware function.
   */
  return function *() {
    var args = Array.prototype.slice.call(arguments, 0);

    var next = noop();

    var i = middleware.length;

    while (i--) {
      next = middleware[i].apply(this, args.concat(next));
    }

    yield *next;
  }
}


/**
 * Noop.
 *
 * @api private
 */
function *noop() {}
