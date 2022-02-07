/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

export type PullRequestReviewDecision = "APPROVED" | "CHANGES_REQUESTED" | "REVIEW_REQUIRED" | "%future added value";
export type GetReviewsQueryVariables = {
    query: string;
};
export type GetReviewsQueryResponse = {
    readonly search: {
        readonly issueCount: number;
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly number?: number | undefined;
                readonly title?: string | undefined;
                readonly isDraft?: boolean | undefined;
                readonly createdAt?: unknown | undefined;
                readonly mergedAt?: unknown | null | undefined;
                readonly url?: unknown | undefined;
                readonly changedFiles?: number | undefined;
                readonly additions?: number | undefined;
                readonly deletions?: number | undefined;
                readonly body?: string | undefined;
                readonly updatedAt?: unknown | undefined;
                readonly reviewDecision?: PullRequestReviewDecision | null | undefined;
                readonly reviewRequests?: {
                    readonly totalCount: number;
                    readonly edges: ReadonlyArray<{
                        readonly node: {
                            readonly id: string;
                            readonly requestedReviewer: {
                                readonly id?: string | undefined;
                                readonly avatarUrl?: unknown | undefined;
                            } | null;
                        } | null;
                    } | null> | null;
                } | null | undefined;
                readonly author?: {
                    readonly login: string;
                    readonly avatarUrl: unknown;
                } | null | undefined;
                readonly repository?: {
                    readonly name: string;
                    readonly nameWithOwner: string;
                    readonly owner: {
                        readonly avatarUrl: unknown;
                    };
                } | undefined;
            } | null;
        } | null> | null;
    };
};
export type GetReviewsQuery = {
    readonly response: GetReviewsQueryResponse;
    readonly variables: GetReviewsQueryVariables;
};



/*
query GetReviewsQuery(
  $query: String!
) {
  search(first: 100, type: ISSUE, query: $query) {
    issueCount
    edges {
      node {
        __typename
        ... on PullRequest {
          number
          title
          isDraft
          createdAt
          mergedAt
          url
          changedFiles
          additions
          deletions
          body
          updatedAt
          reviewDecision
          reviewRequests(first: 100) {
            totalCount
            edges {
              node {
                id
                requestedReviewer {
                  __typename
                  ... on User {
                    id
                    avatarUrl
                  }
                  ... on Node {
                    __isNode: __typename
                    id
                  }
                }
              }
            }
          }
          author {
            __typename
            login
            avatarUrl
            ... on Node {
              __isNode: __typename
              id
            }
          }
          repository {
            name
            nameWithOwner
            owner {
              __typename
              avatarUrl
              id
            }
            id
          }
        }
        ... on Node {
          __isNode: __typename
          id
        }
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "query"
  }
],
v1 = {
  "kind": "Literal",
  "name": "first",
  "value": 100
},
v2 = [
  (v1/*: any*/),
  {
    "kind": "Variable",
    "name": "query",
    "variableName": "query"
  },
  {
    "kind": "Literal",
    "name": "type",
    "value": "ISSUE"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "issueCount",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "number",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isDraft",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mergedAt",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "changedFiles",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "additions",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deletions",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "body",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "updatedAt",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "reviewDecision",
  "storageKey": null
},
v16 = [
  (v1/*: any*/)
],
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatarUrl",
  "storageKey": null
},
v20 = {
  "kind": "InlineFragment",
  "selections": [
    (v18/*: any*/),
    (v19/*: any*/)
  ],
  "type": "User",
  "abstractKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "login",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "nameWithOwner",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v25 = {
  "kind": "InlineFragment",
  "selections": [
    (v18/*: any*/)
  ],
  "type": "Node",
  "abstractKey": "__isNode"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GetReviewsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "SearchResultItemConnection",
        "kind": "LinkedField",
        "name": "search",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "SearchResultItemEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v4/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/),
                      (v11/*: any*/),
                      (v12/*: any*/),
                      (v13/*: any*/),
                      (v14/*: any*/),
                      (v15/*: any*/),
                      {
                        "alias": null,
                        "args": (v16/*: any*/),
                        "concreteType": "ReviewRequestConnection",
                        "kind": "LinkedField",
                        "name": "reviewRequests",
                        "plural": false,
                        "selections": [
                          (v17/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "ReviewRequestEdge",
                            "kind": "LinkedField",
                            "name": "edges",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "ReviewRequest",
                                "kind": "LinkedField",
                                "name": "node",
                                "plural": false,
                                "selections": [
                                  (v18/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": null,
                                    "kind": "LinkedField",
                                    "name": "requestedReviewer",
                                    "plural": false,
                                    "selections": [
                                      (v20/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": "reviewRequests(first:100)"
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "author",
                        "plural": false,
                        "selections": [
                          (v21/*: any*/),
                          (v19/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Repository",
                        "kind": "LinkedField",
                        "name": "repository",
                        "plural": false,
                        "selections": [
                          (v22/*: any*/),
                          (v23/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "owner",
                            "plural": false,
                            "selections": [
                              (v19/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "type": "PullRequest",
                    "abstractKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GetReviewsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "SearchResultItemConnection",
        "kind": "LinkedField",
        "name": "search",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "SearchResultItemEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v24/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
                      (v4/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/),
                      (v11/*: any*/),
                      (v12/*: any*/),
                      (v13/*: any*/),
                      (v14/*: any*/),
                      (v15/*: any*/),
                      {
                        "alias": null,
                        "args": (v16/*: any*/),
                        "concreteType": "ReviewRequestConnection",
                        "kind": "LinkedField",
                        "name": "reviewRequests",
                        "plural": false,
                        "selections": [
                          (v17/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "ReviewRequestEdge",
                            "kind": "LinkedField",
                            "name": "edges",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "ReviewRequest",
                                "kind": "LinkedField",
                                "name": "node",
                                "plural": false,
                                "selections": [
                                  (v18/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": null,
                                    "kind": "LinkedField",
                                    "name": "requestedReviewer",
                                    "plural": false,
                                    "selections": [
                                      (v24/*: any*/),
                                      (v20/*: any*/),
                                      (v25/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": "reviewRequests(first:100)"
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "author",
                        "plural": false,
                        "selections": [
                          (v24/*: any*/),
                          (v21/*: any*/),
                          (v19/*: any*/),
                          (v25/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Repository",
                        "kind": "LinkedField",
                        "name": "repository",
                        "plural": false,
                        "selections": [
                          (v22/*: any*/),
                          (v23/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "owner",
                            "plural": false,
                            "selections": [
                              (v24/*: any*/),
                              (v19/*: any*/),
                              (v18/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v18/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "type": "PullRequest",
                    "abstractKey": null
                  },
                  (v25/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d685ae3b9be82b65c4119c732bd3e832",
    "id": null,
    "metadata": {},
    "name": "GetReviewsQuery",
    "operationKind": "query",
    "text": "query GetReviewsQuery(\n  $query: String!\n) {\n  search(first: 100, type: ISSUE, query: $query) {\n    issueCount\n    edges {\n      node {\n        __typename\n        ... on PullRequest {\n          number\n          title\n          isDraft\n          createdAt\n          mergedAt\n          url\n          changedFiles\n          additions\n          deletions\n          body\n          updatedAt\n          reviewDecision\n          reviewRequests(first: 100) {\n            totalCount\n            edges {\n              node {\n                id\n                requestedReviewer {\n                  __typename\n                  ... on User {\n                    id\n                    avatarUrl\n                  }\n                  ... on Node {\n                    __isNode: __typename\n                    id\n                  }\n                }\n              }\n            }\n          }\n          author {\n            __typename\n            login\n            avatarUrl\n            ... on Node {\n              __isNode: __typename\n              id\n            }\n          }\n          repository {\n            name\n            nameWithOwner\n            owner {\n              __typename\n              avatarUrl\n              id\n            }\n            id\n          }\n        }\n        ... on Node {\n          __isNode: __typename\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '79c86e32f5606019558d8ca286aceb85';
export default node;
