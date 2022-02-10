import * as React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Input, Button, Text} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/core';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Picker} from '@react-native-picker/picker';
import {AppStackParamsList} from 'types';
import {CloseIcon} from 'components/Icons';
import AppHeader from 'components/AppHeader';
import getAppIssueTemplates from 'api/gitwatch/getAppIssueTemplates';
import {GQLIssueTemplate} from 'graphql/schema';
import Toast from 'react-native-toast-message';

import styles from './index.style';
import createAppIssue from 'api/gitwatch/createAppIssue';
import openExternalLink from 'utils/openExternalLink';

interface IProps {}

type Props = NativeStackScreenProps<AppStackParamsList, 'Feedbacks'>;

type NavigationProps = Props['navigation'];

interface Values {
  repositoryId: string;
  title: string;
  body: string;
  issueTemplate: string;
}

const FeedbackSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  body: Yup.string().min(24, 'Too Short!').required('Required'),
  issueTemplate: Yup.string().required('Required'),
});

function FeedbacksScreen() {
  const {goBack} = useNavigation<NavigationProps>();

  const [loading, setLoading] = React.useState(true);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [templates, setTemplates] = React.useState<GQLIssueTemplate[]>([]);
  const [issueUrl, setIssueUrl] = React.useState('');

  const {
    setFieldValue,
    values,
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    errors,
    isSubmitting,
  } = useFormik({
    initialValues: {
      repositoryId: '',
      title: '',
      body: '',
      issueTemplate: '',
    },
    initialErrors: {
      title: 'Required',
      body: 'Required',
    },
    validationSchema: FeedbackSchema,
    onSubmit: async submitValues => {
      try {
        const url = await createAppIssue(submitValues);
        setIssueUrl(url);
      } catch (e) {
        console.log('onsubmit error', e);
      }
    },
  });

  const goToBack = () => goBack();

  /**
   * Render header back button
   */
  const renderBackAction = () => {
    return (
      <TouchableOpacity onPress={goToBack}>
        <CloseIcon />
      </TouchableOpacity>
    );
  };

  const renderTitlePrefix = () => {
    return <Text category="c1">{`[${values.issueTemplate}]`}</Text>;
  };

  const renderCaption = React.useCallback(() => {
    if (templates.length) {
      return (
        <View style={{marginTop: 4}}>
          <Text category="c2">{templates[selectedIndex].about}</Text>
        </View>
      );
    }
  }, [selectedIndex, templates]);

  React.useEffect(() => {
    async function getTemplates() {
      const {id, issueTemplates} = await getAppIssueTemplates(
        'leonardoballand/GitWatch',
      );
      setTemplates(issueTemplates);
      setSelectedIndex(0);
      setFieldValue('issueTemplate', issueTemplates[0].name);
      setFieldValue('repositoryId', id);
      setLoading(false);
    }

    getTemplates();
  }, []);

  if (!selectedIndex && loading) {
    return null;
  }

  if (issueUrl) {
    return (
      <>
        <AppHeader
          title="Thank you for your time"
          description="Track your request"
          level={4}
          accessoryLeft={renderBackAction}
        />

        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            paddingHorizontal: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{marginBottom: 4}} category="s2">
            Open this link to track your newly created request
          </Text>
          <TouchableOpacity onPress={() => openExternalLink(issueUrl)}>
            <Text style={{fontSize: 12, textAlign: 'center'}} status="primary">
              {issueUrl}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      <AppHeader
        title="Send feedback"
        description="Tell us how happens"
        level={4}
        accessoryLeft={renderBackAction}
      />

      <View style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 16}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            paddingBottom: 24,
          }}>
          <View>
            <Picker
              selectedValue={values.issueTemplate}
              mode="dropdown"
              onValueChange={(itemValue, index) => {
                console.log('index', index);

                setSelectedIndex(index);
                setFieldValue('issueTemplate', itemValue);
              }}>
              {templates.map(template => (
                <Picker.Item label={template.name} value={template.name} />
              ))}
            </Picker>

            <Input
              style={{marginBottom: 24}}
              label="Subject"
              placeholder="Bug within feedback form"
              size="large"
              autoCorrect={false}
              autoFocus
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              value={values.title}
              accessoryLeft={renderTitlePrefix}
              caption={renderCaption}
              status={touched.title && errors.title ? 'danger' : 'basic'}
            />

            <Input
              label="Explain us what's happened"
              placeholder="I cannot send my feedback :("
              size="large"
              multiline
              autoCorrect={false}
              textStyle={{minHeight: 64}}
              onChangeText={handleChange('body')}
              onBlur={handleBlur('body')}
              value={values.body}
              status={touched.body && errors.body ? 'danger' : 'basic'}
            />
          </View>

          <Button
            disabled={!!Object.keys(errors).length || isSubmitting}
            style={{borderRadius: 24}}
            onPress={handleSubmit}>
            Send your feedback
          </Button>
        </View>
      </View>
    </>
  );
}

export default FeedbacksScreen;
