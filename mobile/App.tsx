import { StatusBar } from 'react-native';
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts
} from '@expo-google-fonts/roboto';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { Loading } from '@components/Loading';
import { config } from './config/gluestack-ui.config';
import { Routes } from '@routes/index';
import { AuthContextProvider } from '@contexts/AuthContext';
import { NotificationClickEvent, OneSignal } from 'react-native-onesignal';
import { useEffect } from 'react';

OneSignal.initialize('5248be65-0fb6-4fbb-a7b8-ff54b4dc5f05');
OneSignal.Notifications.requestPermission(true);

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_700Bold, Roboto_400Regular });

  useEffect(() => {
    const handleNotificationClick = (event: NotificationClickEvent): void => {
      const { actionId } = event.result;

      switch (actionId) {
        case '1':
          console.log('Ver todos')
          break;
        case '2':
          console.log('Ver pedido')
          break;
        default: console.log('Nenhum botão de ação selecionado.')
      }
    };

    OneSignal.Notifications.addEventListener('click', handleNotificationClick);

    return () => OneSignal.Notifications.removeEventListener('click', handleNotificationClick);
  }, []);

  return (
    <GluestackUIProvider config={config}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContextProvider>
    </GluestackUIProvider>
  )
}
