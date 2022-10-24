"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuery = void 0;
const core_1 = require("@urql/core");
const solid_js_1 = require("solid-js");
const wonka_1 = require("wonka");
const context_1 = require("./context");
const createQuery = (args, { deferStream, } = {}) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const client = (0, context_1.useClient)();
    const subscriptions = [];
    // Resource fetcher
    const fetcher = (source, { refetching }) => {
        return new Promise((resolve, reject) => {
            const subscription = (0, wonka_1.pipe)((0, wonka_1.combine)((0, wonka_1.fromValue)(source), (0, wonka_1.fromValue)(refetching)), (0, wonka_1.switchMap)(([source$, refetching$]) => {
                if (source$.pause)
                    return wonka_1.never;
                // If refetching, merge refetch options into main source options
                const mergedSource = isRefetchPayload(refetching$)
                    ? {
                        ...source$,
                        ...refetching$,
                    }
                    : source$;
                const request = (0, core_1.createRequest)(mergedSource.query, mergedSource.variables);
                const operation = client.createRequestOperation("query", request, {
                    requestPolicy: mergedSource.requestPolicy,
                    ...mergedSource.context,
                });
                return client.executeRequestOperation(operation);
            }), (0, wonka_1.subscribe)((result) => {
                if (result.error)
                    reject(result.error);
                else
                    resolve(result);
            }));
            subscriptions.push(subscription);
        });
    };
    (0, solid_js_1.onCleanup)(() => {
        subscriptions.forEach((sub) => sub.unsubscribe());
    });
    // Create the resource and override the refetch method for better typing/defaults.
    const [data, ops] = (0, solid_js_1.createResource)(args, fetcher, { deferStream });
    const refetch = (args = {}) => ops.refetch(args);
    return [
        data,
        {
            ...ops,
            refetch,
        },
    ];
};
exports.createQuery = createQuery;
const isRefetchPayload = (payload) => typeof payload === "object" && payload !== null;
