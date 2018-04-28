/**
 * Polyfill for Function.name.
 * Inspired from https://github.com/JamesMGreene/Function.name
 */
export default (() => {
    const fnNameRegex = /^\s*function\s+([^\(\s]*)\s*/;

    // Inspect the polyfill-ability of this browser
    const needsPolyfill: boolean = !("name" in Function.prototype && "name" in (function x() {}));
    const canDefineProp: boolean = typeof Object.defineProperty === "function";

    function _name() {
        let match, name;

        if (this === Function || this === Function.prototype.constructor) {
            name = 'Function';
        } else if (this !== Function.prototype) {
            match = ('' + this).match(fnNameRegex);
            name = match && match[1];
        }

        return name || '';
    }

    // Should work for IE >=9
    if (needsPolyfill && canDefineProp) {
        Object.defineProperty(Function.prototype, 'name', {
            get: function() {
                const name = _name.call(this);

                // Since named function definitions have immutable names, also memoize the
                // output by defining the `name` property directly on this Function
                // instance so that this polyfill will not need to be invoked again
                if (this !== Function.prototype) {
                    Object.defineProperty(this, "name", {
                        value: name,
                        configurable: true
                    });
                }

                return name;
            },
            configurable: true
        })
    }
})();
