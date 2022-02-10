import React from 'react';
import {Platform} from 'react-native';
import appDistribution, {
  FirebaseAppDistributionTypes,
} from '@react-native-firebase/app-distribution';

function useFirebaseUpdates(
  onUpdates: (
    arg0: FirebaseAppDistributionTypes.AppDistributionRelease,
  ) => void,
) {
  const checkUpdates = async () => {
    if (Platform.OS === 'ios') {
      const updateAlertsEnabled = await appDistribution().isTesterSignedIn();

      if (updateAlertsEnabled) {
        const data = await appDistribution().checkForUpdate();
        console.log('data', data);

        onUpdates(data);
      }
    }
  };

  React.useEffect(() => {
    checkUpdates();
  }, []);
}

export default useFirebaseUpdates;
