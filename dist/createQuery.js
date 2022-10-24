import { createRequest, } from "@urql/core";
import { createResource, onCleanup } from "solid-js";
import { combine, fromValue, never, pipe, subscribe, switchMap, } from "wonka";
import { useClient } from "./context";
export const createQuery = (args, { deferStream, } = {}) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const client = useClient();
    const subscriptions = [];
    // Resource fetcher
    const fetcher = (source, { refetching }) => {
        return new Promise((resolve, reject) => {
            const subscription = pipe(combine(fromValue(source), fromValue(refetching)), switchMap(([source$, refetching$]) => {
                if (source$.pause)
                    return never;
                // If refetching, merge refetch options into main source options
                const mergedSource = isRefetchPayload(refetching$)
                    ? {
                        ...source$,
                        ...refetching$,
                    }
                    : source$;
                const request = createRequest(mergedSource.query, mergedSource.variables);
                const operation = client.createRequestOperation("query", request, {
                    requestPolicy: mergedSource.requestPolicy,
                    ...mergedSource.context,
                });
                return client.executeRequestOperation(operation);
            }), subscribe((result) => {
                if (result.error)
                    reject(result.error);
                else
                    resolve(result);
            }));
            subscriptions.push(subscription);
        });
    };
    onCleanup(() => {
        subscriptions.forEach((sub) => sub.unsubscribe());
    });
    // Create the resource and override the refetch method for better typing/defaults.
    const [data, ops] = createResource(args, fetcher, { deferStream });
    const refetch = (args = {}) => ops.refetch(args);
    return [
        data,
        {
            ...ops,
            refetch,
        },
    ];
};
const isRefetchPayload = (payload) => typeof payload === "object" && payload !== null;
