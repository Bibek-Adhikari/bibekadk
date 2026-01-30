import { registerRootComponent } from 'expo';
import 'react-native-get-random-values'; // Import here as well for global polyfills if needed
import { RootNavigator } from './src/navigation/RootNavigator';

registerRootComponent(RootNavigator);
