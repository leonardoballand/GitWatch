/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

export type GetUserQueryVariables = {
    login: string;
};
export type GetUserQueryResponse = {
    readonly user: {
        readonly id: string;
        readonly login: string;
        readonly name: string | null;
        readonly avatarUrl: unknown;
    } | null;
};
export type GetUserQuery = {
    readonly response: GetUserQueryResponse;
    readonly variables: GetUserQueryVariables;
};



/*
query GetUserQuery(
  $login: String!
) {
  user(login: $login) {
    id
    login
    name
    avatarUrl
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "login"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "login",
        "variableName": "login"
      }
    ],
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "user",
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
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GetUserQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GetUserQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "5840160368ae86a08dd29ef61ddfdc35",
    "id": null,
    "metadata": {},
    "name": "GetUserQuery",
    "operationKind": "query",
    "text": "query GetUserQuery(\n  $login: String!\n) {\n  user(login: $login) {\n    id\n    login\n    name\n    avatarUrl\n  }\n}\n"
  }
};
})();
(node as any).hash = '934d1e04bca19083ff033fae1d4102fe';
export default node;
