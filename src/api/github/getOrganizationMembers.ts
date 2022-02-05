import environment from 'graphql/environment';
import GetOrganizationMembersQuery from 'graphql/queries/GetOrganizationMembers';
import {GQLOrganizationMemberConnection} from 'graphql/schema';
import {GetOrganizationMembersQuery as GetOrganizationMembersQueryType} from 'graphql/__generated__/GetOrganizationMembersQuery.graphql';
import {fetchQuery} from 'react-relay';

const getOrganizationMembers = async (
  login: string,
  after: string | null = null,
  before: string | null = null,
  first: number | null = 100,
  last: number | null = null,
): Promise<GQLOrganizationMemberConnection> => {
  return new Promise((resolve, reject) => {
    fetchQuery<GetOrganizationMembersQueryType>(
      environment,
      GetOrganizationMembersQuery,
      {
        login,
        after,
        before,
        first,
        last,
      },
    ).subscribe({
      next: data => {
        resolve(data.organization?.membersWithRole);
      },
      error: (err: any) => reject(err),
    });
  });
};

export default getOrganizationMembers;
