import { Redirect } from 'expo-router';

export default function Index() {
  // Redirigir a la pantalla de login por defecto
  return <Redirect href="/auth/login" />;
}