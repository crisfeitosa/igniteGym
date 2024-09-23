import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import { gluestackUIConfig } from '../../config/gluestack-ui.config';
import { Box } from '@gluestack-ui/themed';
import { AuthRoutes } from './auth.routes';

export function Routes() {
  const theme = DefaultTheme;
  theme.colors.background = gluestackUIConfig.tokens.colors.gray700

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        <AuthRoutes />
      </NavigationContainer>
    </Box>
  );
}