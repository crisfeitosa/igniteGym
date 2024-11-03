import { HStack,Text, Icon, Pressable } from '@gluestack-ui/themed';
import { Bell, X } from 'lucide-react-native';
import { OSNotification } from 'react-native-onesignal';
import * as Linking from 'expo-linking';

type Props = {
  data: OSNotification;
  onClose: () => void;
};

type CustomOSNotification = {
  custom: any
  u: string
}

export function Notification({ data, onClose }: Readonly<Props>) {
  function handleOnPress() {
    const { custom }: CustomOSNotification = JSON.parse(
      data.rawPayload.toString(),
    )
    const { u: uri }: CustomOSNotification = JSON.parse(custom.toString())

    if (uri) {
      Linking.openURL(uri)
      onClose()
    }
  }

  return (
    <Pressable w="$full" p="$4" pt="$12" bgColor="$gray200" position="absolute" top={0} onPress={handleOnPress}>
      <HStack justifyContent="space-between" alignItems="center">
        <Icon as={Bell} color="black" mr="$5" size="xl" />

        <Text fontSize="$lg" color="black" flex={1}>
          {data.title}
        </Text>

        <Pressable onPress={onClose}>
          <Icon as={X} color="$coolGray600" size="xl" />
        </Pressable>
      </HStack>
    </Pressable>
  );
}