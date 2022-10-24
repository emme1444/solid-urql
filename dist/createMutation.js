import { createRequest, } from "@urql/core";
import { createResource, onCleanup } from "solid-js";
import { fromValue, pipe, subscribe, switchMap, } from "wonka";
import { useClient } from "./context";
export const createMutation = (query, { deferStream, } = {}) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const client = useClient();
    const subscriptions = [];
    const fetcher = (_, { refetching }) => {
        return new Promise((resolve, reject) => {
            const subscription = pipe(fromValue(refetching), switchMap((source$) => {
                // Only execute the mutation when in "refetch" mode, which is
                //  detected when refetching is not false
                if (isExecutePayload(source$)) {
                    const request = createRequest(query, source$.variables);
                    const operation = client.createRequestOperation("mutation", request, source$.context);
                    return client.executeRequestOperation(operation);
                }
                // On first pass, just pass-thru "idle" flag.
                return fromValue("idle");
            }), subscribe((_result) => {
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
    onCleanup(() => {
        subscriptions.forEach((sub) => sub.unsubscribe());
    });
    // const myFetcher: ResourceFetcher<true, {}> = () => {};
    //
    // const [myResult, { refetch: r }] = createResource(myFetcher, {
    //   deferStream,
    // });
    // Create the resource and custom-define execute fn
    const [result, { refetch }] = createResource(fetcher, {
        deferStream,
    });
    const executeMutation = (variables, context) => Promise.resolve(refetch({ variables, context }));
    return [result, executeMutation];
};
const isExecutePayload = (payload) => typeof payload === "object" &&
    payload !== null &&
    "variables" in payload &&
    "context" in payload;
