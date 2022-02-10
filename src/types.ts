import {FirebaseAppDistributionTypes} from '@react-native-firebase/app-distribution';
import {GQLPullRequest, GQLRepository} from 'graphql/schema';

export interface GitWatchUser {
  accessToken: string;
  id: string;
  avatarUrl: string;
  email?: string;
  login: string;
  managerMode: boolean;
  location?: string;
  company?: string;
  name: string;
  firstName: string;
  lastName: string;
}

export type AppStackParamsList = {
  Home: undefined;
  Onboarding: undefined;
  Login: undefined;
  SelectRepositories: undefined;
  PullRequestDetails: {
    data: GQLPullRequest;
  };
  Configuration: {
    organizations: string[];
    repositories: GQLRepository[];
  };
  ManageAccount: undefined;
  Feedbacks: undefined;
  AppUpdate: FirebaseAppDistributionTypes.AppDistributionRelease;
};

export type TabStackParamsList = {
  Dashboard: undefined;
  Week5: undefined;
  Settings: undefined;
};

export type Week5StackParamsList = {
  Week5Home: undefined;
  Week5SelectMembers: undefined;
  Week5SelectMilestone: undefined;
  Week5SelectIssue: undefined;
};
