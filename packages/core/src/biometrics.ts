import { BiometricsError } from './errors';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

/**
 * Requests user biometrics authentication. Throws an error if not authenticated.
 */
const biometricAuthentication = async (): Promise<void> => {
  await rnBiometrics
    .isSensorAvailable()
    .then(async biometrics => {
      if (biometrics.available) {
        const biometricCheck = await rnBiometrics.simplePrompt({
          promptMessage: 'Awaiting Authorization',
        });
        if (biometricCheck.error) {
          // Caller should catch and handle as 'unauthorized'.
          throw new BiometricsError(biometricCheck.error);
        }
        if (!biometricCheck.success) {
          // User is not authorized.
          throw new BiometricsError('User not authorized');
        }
      } else {
        // No biometrics available, passive authorization.
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch(() => {
      throw new BiometricsError('User not authorized');
    });
};

export { biometricAuthentication };
