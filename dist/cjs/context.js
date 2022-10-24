"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClient = exports.Provider = exports.Context = void 0;
const core_1 = require("@urql/core");
const solid_js_1 = require("solid-js");
// We assume some default options here; mainly not to actually be used
// but not to error catastrophically if someone is just playing around
const defaultClient = (0, core_1.createClient)({ url: '/graphql' });
exports.Context = (0, solid_js_1.createContext)(defaultClient);
exports.Provider = exports.Context.Provider;
let hasWarnedAboutDefault = false;
const useClient = () => {
    const client = (0, solid_js_1.useContext)(exports.Context);
    if (process.env.NODE_ENV !== 'production' &&
        client === defaultClient &&
        !hasWarnedAboutDefault) {
        hasWarnedAboutDefault = true;
        console.warn("Default Client: No client has been specified using urql's Provider." +
            'This means that urql will be falling back to defaults including making ' +
            'requests to `/graphql`.\n' +
            "If that's not what you want, please create a client and add a Provider.");
    }
    return client;
};
exports.useClient = useClient;
