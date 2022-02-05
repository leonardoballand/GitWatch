/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

export type OrganizationMemberRole = "ADMIN" | "MEMBER" | "%future added value";
export type GetOrganizationMembersQueryVariables = {
    login: string;
    after?: string | null | undefined;
    before?: string | null | undefined;
    first?: number | null | undefined;
    last?: number | null | undefined;
};
export type GetOrganizationMembersQueryResponse = {
    readonly organization: {
        readonly membersWithRole: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly login: string;
                    readonly avatarUrl: unknown;
                } | null;
                readonly role: OrganizationMemberRole | null;
            } | null> | null;
            readonly totalCount: number;
            readonly pageInfo: {
                readonly endCursor: string | null;
                readonly hasNextPage: boolean;
                readonly hasPreviousPage: boolean;
                readonly startCursor: string | null;
            };
        };
    } | null;
};
export type GetOrganizationMembersQuery = {
    readonly response: GetOrganizationMembersQueryResponse;
    readonly variables: GetOrganizationMembersQueryVariables;
};



/*
query GetOrganizationMembersQuery(
  $login: String!
  $after: String
  $before: String
  $first: Int
  $last: Int
) {
  organization(login: $login) {
    membersWithRole(after: $after, before: $before, first: $first, last: $last) {
      edges {
        node {
          login
          avatarUrl
          id
        }
        role
      }
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "before"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "last"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "login"
},
v5 = [
  {
    "kind": "Variable",
    "name": "login",
    "variableName": "login"
  }
],
v6 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "after"
  },
  {
    "kind": "Variable",
    "name": "before",
    "variableName": "before"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "first"
  },
  {
    "kind": "Variable",
    "name": "last",
    "variableName": "last"
  }
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "login",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "avatarUrl",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "role",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endCursor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasNextPage",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasPreviousPage",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "startCursor",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "GetOrganizationMembersQuery",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v6/*: any*/),
            "concreteType": "OrganizationMemberConnection",
            "kind": "LinkedField",
            "name": "membersWithRole",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "OrganizationMemberEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "User",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v7/*: any*/),
                      (v8/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v9/*: any*/)
                ],
                "storageKey": null
              },
              (v10/*: any*/),
              (v11/*: any*/)
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
    "argumentDefinitions": [
      (v4/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Operation",
    "name": "GetOrganizationMembersQuery",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": "Organization",
        "kind": "LinkedField",
        "name": "organization",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v6/*: any*/),
            "concreteType": "OrganizationMemberConnection",
            "kind": "LinkedField",
            "name": "membersWithRole",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "OrganizationMemberEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "User",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v12/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v9/*: any*/)
                ],
                "storageKey": null
              },
              (v10/*: any*/),
              (v11/*: any*/)
            ],
            "storageKey": null
          },
          (v12/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "1c4fe303d798d6a7cb6e7b65ccf9a673",
    "id": null,
    "metadata": {},
    "name": "GetOrganizationMembersQuery",
    "operationKind": "query",
    "text": "query GetOrganizationMembersQuery(\n  $login: String!\n  $after: String\n  $before: String\n  $first: Int\n  $last: Int\n) {\n  organization(login: $login) {\n    membersWithRole(after: $after, before: $before, first: $first, last: $last) {\n      edges {\n        node {\n          login\n          avatarUrl\n          id\n        }\n        role\n      }\n      totalCount\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = '8c4dc9ad37c17d578ba8676a420703c2';
export default node;
