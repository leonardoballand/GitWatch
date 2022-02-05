/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

export type GetViewerQueryVariables = {};
export type GetViewerQueryResponse = {
    readonly viewer: {
        readonly id: string;
        readonly login: string;
        readonly name: string | null;
        readonly avatarUrl: unknown;
        readonly email: string;
        readonly location: string | null;
        readonly company: string | null;
    };
};
export type GetViewerQuery = {
    readonly response: GetViewerQueryResponse;
    readonly variables: GetViewerQueryVariables;
};



/*
query GetViewerQuery {
  viewer {
    id
    login
    name
    avatarUrl
    email
    location
    company
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "viewer",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "login",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "avatarUrl",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "email",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "location",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "company",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "GetViewerQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "GetViewerQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "e016cf5539627121b3b0b5555158a638",
    "id": null,
    "metadata": {},
    "name": "GetViewerQuery",
    "operationKind": "query",
    "text": "query GetViewerQuery {\n  viewer {\n    id\n    login\n    name\n    avatarUrl\n    email\n    location\n    company\n  }\n}\n"
  }
};
})();
(node as any).hash = 'aed18df3bad139f891b89c2e230c049b';
export default node;
