"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMutation = void 0;
const core_1 = require("@urql/core");
const solid_js_1 = require("solid-js");
const wonka_1 = require("wonka");
const context_1 = require("./context");
const createMutation = (query, { deferStream, } = {}) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const client = (0, context_1.useClient)();
    const subscriptions = [];
    const fetcher = (_, { refetching }) => {
        return new Promise((resolve, reject) => {
            const subscription = (0, wonka_1.pipe)((0, wonka_1.fromValue)(refetching), (0, wonka_1.switchMap)((source$) => {
                // Only execute the mutation when in "refetch" mode, which is
                //  detected when refetching is not false
                if (isExecutePayload(source$)) {
                    const request = (0, core_1.createRequest)(query, source$.variables);
                    const operation = client.createRequestOperation("mutation", request, source$.context);
                    return client.executeRequestOperation(operation);
                }
                // On first pass, just pass-thru "idle" flag.
                return (0, wonka_1.fromValue)("idle");
            }), (0, wonka_1.subscribe)((_result) => {
                if (_result === "idle") {
                    resolve(undefined);
                }
                else {
                    if (_result.error)
                        reject(_result.error);
                    else
                        resolve(_result);
                }
            }));
            subscriptions.push(subscription);
        });
    };
    (0, solid_js_1.onCleanup)(() => {
        subscriptions.forEach((sub) => sub.unsubscribe());
    });
    // const myFetcher: ResourceFetcher<true, {}> = () => {};
    //
    // const [myResult, { refetch: r }] = createResource(myFetcher, {
    //   deferStream,
    // });
    // Create the resource and custom-define execute fn
    const [result, { refetch }] = (0, solid_js_1.createResource)(fetcher, {
        deferStream,
    });
    const executeMutation = (variables, context) => Promise.resolve(refetch({ variables, context }));
    return [result, executeMutation];
};
exports.createMutation = createMutation;
const isExecutePayload = (payload) => typeof payload === "object" &&
    payload !== null &&
    "variables" in payload &&
    "context" in payload;
