import { OperationContext, OperationResult, RequestPolicy, TypedDocumentNode } from "@urql/core";
import { Accessor } from "solid-js";
import { DocumentNode } from "graphql";
export declare const createQuery: <Data = any, Variables = object>(args: Accessor<CreateQueryArgs<Variables, Data>>, { deferStream, }?: {
    deferStream?: boolean | undefined;
}) => readonly [import("solid-js").Resource<OperationResult<Data, Variables>>, {
    readonly refetch: (args?: Partial<CreateQueryArgs<Variables, Data>>) => OperationResult<Data, Variables> | Promise<OperationResult<Data, Variables> | undefined> | null | undefined;
    readonly mutate: import("solid-js").Setter<OperationResult<Data, Variables> | undefined>;
}];
export declare type CreateQueryArgs<Variables = object, Data = any> = {
    query: string | DocumentNode | TypedDocumentNode<Data, Variables>;
    variables?: Variables;
    requestPolicy?: RequestPolicy;
    context?: Partial<OperationContext>;
    pause?: boolean;
};
