import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Octicon from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export const SettingsIcon = (props: any) => (
  <Icon {...props} size={24} name="person" />
);

export const WorkflowIcon = (props: any) => (
  <Octicon {...props} size={24} name="play" />
);

export const PullRequestIcon = (props: any) => (
  <Octicon {...props} size={24} name="git-pull-request" />
);

export const ReadyIcon = (props: any) => (
  <Octicon {...props} size={24} name="git-pull-request" />
);

export const DraftIcon = (props: any) => (
  <Octicon {...props} size={24} name="git-pull-request" />
);

export const ReviewIcon = (props: any) => (
  <Octicon {...props} size={24} name="code" />
);

export const FileIcon = (props: any) => (
  <Octicon {...props} size={24} name="file" />
);

export const BackIcon = (props: any) => (
  <Icon {...props} name="arrow-back" size={24} />
);

export const CloseIcon = (props: any) => (
  <Icon {...props} name="close" size={24} />
);

export const NextIcon = (props: any) => (
  <Icon {...props} name="chevron-right" size={24} />
);

export const Week5Icon = (props: any) => <Icon {...props} name="next-week" />;

export const DashboardIcon = (props: any) => (
  <Icon {...props} name="grid-view" />
);

export const NotificationsIcon = (props: any) => (
  <Icon {...props} name="notifications" size={24} />
);

export const ActionFailedIcon = (props: any) => (
  <MaterialCommunityIcon
    {...props}
    size={24}
    name="close-circle"
    color="rgb(248, 81, 73)"
  />
);

export const ActionCompletedIcon = (props: any) => (
  <MaterialCommunityIcon
    {...props}
    size={24}
    name="check-circle"
    color="rgb(63, 185, 80)"
  />
);

export const ActionStoppedIcon = (props: any) => (
  <Octicon size={24} name="stop" color="rgb(139, 148, 158)" {...props} />
);

export const ActionPendingIcon = (props: any) => (
  <Octicon {...props} size={24} name="primitive-dot" color="rgb(158, 106, 3)" />
);
