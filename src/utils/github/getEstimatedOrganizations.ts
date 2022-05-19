import type {GQLIssue} from 'graphql/schema';

// Extract user active organizations
const getEstimatedOrganizations = (issues: GQLIssue[]) => {
  const organizations: string[] = [];

  issues.forEach(issue => {
    const {
      owner: {login: organizationName},
    } = issue.repository;

    if (!organizations.includes(organizationName)) {
      organizations.push(organizationName);
    }
  });

  return organizations;
};

export default getEstimatedOrganizations;
