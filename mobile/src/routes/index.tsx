import { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useAuth } from '@hooks/useAuth';
import { NotificationWillDisplayEvent, OneSignal, OSNotification } from 'react-native-onesignal';
import { gluestackUIConfig } from '../../config/gluestack-ui.config';
import { Box } from '@gluestack-ui/themed';
import { Loading } from '@components/Loading';
import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';
import { Notification } from '@components/Notification';

const linking = {
  prefixes: ['igniteGym://', 'com.crisfeitosa.ignitegym://', 'exp+ignitegym://'],
  config: {
    screens: {
      signIn: {
        path: '/signIn',
      },
      signUp: {
        path: '/signUp',
      },
      home: {
        path: '/home',
      },
      exercise: {
        path: '/exercise/:exerciseId',
        parse: {
          exerciseId: (exerciseId: string) => exerciseId,
        }
      },
      profile: {
        path: '/profile',
      },
      history: {
        path: '/history',
      },
    }
  }
};

export function Routes() {
  const [notification, setNotification] = useState<OSNotification>();
  const { user, isLoadingUserStorageData } = useAuth();
  const theme = DefaultTheme;
  theme.colors.background = gluestackUIConfig.tokens.colors.gray700;

  useEffect(() => {
    const handleNotification = (event: NotificationWillDisplayEvent): void => {
      event.preventDefault();
      const response = event.getNotification();
      setNotification(response);
    };

    OneSignal.Notifications.addEventListener(
      'foregroundWillDisplay',
      handleNotification
    )

    return () => OneSignal.Notifications.removeEventListener('foregroundWillDisplay', handleNotification);
  }, []);

  if(isLoadingUserStorageData) {
    return <Loading />
  };

  return (
    <Box flex={1} bg="$gray700">
      <NavigationContainer theme={theme} linking={linking}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}

        {notification?.title && (
          <Notification
            data={notification}
            onClose={() => setNotification(undefined)}
          />
        )}
      </NavigationContainer>
    </Box>
  );
}