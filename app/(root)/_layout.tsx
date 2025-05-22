import { useSession } from "@/context/AuthProvider";
import { Redirect, Stack } from "expo-router";

export default function AuthenticatedLayout() {
  const { user } = useSession();
  if (!user) return <Redirect href={"/sign-in"} />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="exhibit/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
