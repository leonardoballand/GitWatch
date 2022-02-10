/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

export type CreateIssueInput = {
    assigneeIds?: Array<string> | null | undefined;
    body?: string | null | undefined;
    clientMutationId?: string | null | undefined;
    issueTemplate?: string | null | undefined;
    labelIds?: Array<string> | null | undefined;
    milestoneId?: string | null | undefined;
    projectIds?: Array<string> | null | undefined;
    repositoryId: string;
    title: string;
};
export type createAppIssueMutationVariables = {
    input: CreateIssueInput;
};
export type createAppIssueMutationResponse = {
    readonly createIssue: {
        readonly clientMutationId: string | null;
        readonly issue: {
            readonly url: unknown;
        } | null;
    } | null;
};
export type createAppIssueMutation = {
    readonly response: createAppIssueMutationResponse;
    readonly variables: createAppIssueMutationVariables;
};



/*
mutation createAppIssueMutation(
  $input: CreateIssueInput!
) {
  createIssue(input: $input) {
    clientMutationId
    issue {
      url
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "clientMutationId",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "createAppIssueMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateIssuePayload",
        "kind": "LinkedField",
        "name": "createIssue",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Issue",
            "kind": "LinkedField",
            "name": "issue",
            "plural": false,
            "selections": [
              (v3/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "createAppIssueMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateIssuePayload",
        "kind": "LinkedField",
        "name": "createIssue",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Issue",
            "kind": "LinkedField",
            "name": "issue",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
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
    "cacheID": "4471ac813c5f1e886725b2a0183ea85d",
    "id": null,
    "metadata": {},
    "name": "createAppIssueMutation",
    "operationKind": "mutation",
    "text": "mutation createAppIssueMutation(\n  $input: CreateIssueInput!\n) {\n  createIssue(input: $input) {\n    clientMutationId\n    issue {\n      url\n      id\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '53ba57a7c6cad7726c9673e9afc46763';
export default node;
