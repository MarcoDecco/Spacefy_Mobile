import * as LocalAuthentication from 'expo-local-authentication';

// Verifica se a biometria está disponível no dispositivo
export async function isBiometricAvailable() {
  return await LocalAuthentication.hasHardwareAsync();
}

// Verifica se o usuário cadastrou alguma biometria
export async function isEnrolled() {
  return await LocalAuthentication.isEnrolledAsync();
}

// Realiza a autenticação biométrica
export async function authenticateBiometric(promptMessage = 'Autentique-se para continuar') {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    fallbackLabel: 'Usar senha',
    disableDeviceFallback: false,
  });
  return result;
}