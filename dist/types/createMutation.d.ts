import { OperationContext, OperationResult, TypedDocumentNode } from "@urql/core";
import { DocumentNode } from "graphql";
export declare const createMutation: <Data = any, Variables = object>(query: string | DocumentNode | TypedDocumentNode<Data, Variables>, { deferStream, }?: {
    deferStream?: boolean | undefined;
}) => readonly [import("solid-js").Resource<OperationResult<Data, Variables> | undefined>, (variables: Variables, context?: Partial<OperationContext>) => Promise<OperationResult<Data, Variables> | null | undefined>];
