import CustomHeader from "@/components/ui/CustomHeader";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="sign-in"
        options={{
          header: () => <CustomHeader type="welcome" content="welcome to"/>

        }}
      />
      <Stack.Screen
        name="welcome"
        options={{
          header: () => <CustomHeader type="landing" content="Are you ready ?"/>

        }}
      />
    </Stack>
  );
}
