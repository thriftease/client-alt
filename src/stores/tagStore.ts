import {
    TagOrderQueryInput,
    type CreateTagMutationInput,
    type CreateTagMutationPayload,
    type DeleteTagMutationInput,
    type DeleteTagMutationPayload,
    type GetTagQueryInput,
    type GetTagQueryPayload,
    type ListTagsQueryPayload,
    type PaginatorQueryInput,
    type TagFilterQueryInput,
    type UpdateTagMutationInput,
    type UpdateTagMutationPayload
} from "@/gql";
import { apolloMutate, apolloQuery } from "@/utils";
import { gql } from "@apollo/client/core";
import { defineStore } from "pinia";

const useTagStore = defineStore("tagStore", () => {
    async function create(tag: CreateTagMutationInput) {
        const re = await apolloMutate<
            { tag: CreateTagMutationInput },
            { result: CreateTagMutationPayload }
        >(
            { tag },
            gql`
                mutation CreateTag($tag: CreateTagMutationInput!) {
                    result: createTag(input: $tag) {
                        data {
                            ...tagFragment
                        }
                        errors {
                            ...errorFragment
                        }
                    }
                }
            `
        );
        return re;
    }

    async function list(
        params: {
            filter?: TagFilterQueryInput;
            order?: TagOrderQueryInput[];
            paginator?: PaginatorQueryInput;
            options?: {};
        } = {}
    ) {
        const re = await apolloQuery<
            typeof params,
            { result: ListTagsQueryPayload }
        >(
            params,
            gql`
                query ListTags(
                    $filter: TagFilterQueryInput
                    $order: [TagOrderQueryInput!]
                    $paginator: PaginatorQueryInput
                ) {
                    result: listTags(
                        filter: $filter
                        order: $order
                        paginator: $paginator
                    ) {
                        data {
                            ...tagFragment
                        }
                        paginator {
                            ...paginatorFragment
                        }
                    }
                }
            `,
            params.options
        );
        return re;
    }

    async function get(input: GetTagQueryInput) {
        const re = await apolloQuery<
            { input: GetTagQueryInput },
            { result: GetTagQueryPayload }
        >(
            { input },
            gql`
                query GetTag($input: GetTagQueryInput!) {
                    result: getTag(input: $input) {
                        data {
                            ...tagFragment
                        }
                    }
                }
            `
        );
        return re;
    }

    async function update(tag: UpdateTagMutationInput) {
        const re = await apolloMutate<
            { tag: UpdateTagMutationInput },
            { result: UpdateTagMutationPayload }
        >(
            { tag },
            gql`
                mutation UpdateTag($tag: UpdateTagMutationInput!) {
                    result: updateTag(input: $tag) {
                        data {
                            ...tagFragment
                        }
                        errors {
                            ...errorFragment
                        }
                    }
                }
            `
        );
        return re;
    }

    async function del(input: DeleteTagMutationInput) {
        const re = await apolloMutate<
            { input: DeleteTagMutationInput },
            { result: DeleteTagMutationPayload }
        >(
            { input },
            gql`
                mutation DeleteTag($input: DeleteTagMutationInput!) {
                    result: deleteTag(input: $input) {
                        data {
                            ...tagFragment
                        }
                        errors {
                            ...errorFragment
                        }
                    }
                }
            `
        );
        return re;
    }

    async function existing(name: string, options = {}) {
        const re = await apolloQuery<{ name: string }, { result: Boolean }>(
            { name },
            gql`
                query TagExisting($name: String!) {
                    result: tagExisting(name: $name)
                }
            `,
            options
        );
        return re;
    }

    return {
        create,
        list,
        get,
        update,
        delete: del,
        existing
    };
});

export default useTagStore;
