import React from "react";
import { Sheet } from "../nativewindui/Sheet";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Text } from "../nativewindui/Text";
import { View } from "react-native";

export default function BottomSheet({
  bottomSheetModalRef,
}: {
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
}) {
  return (
    <Sheet ref={bottomSheetModalRef} snapPoints={[200]}>
      <BottomSheetView className="flex-1 items-center justify-center pb-8">
        <Text className="text-foreground">@gorhom/bottom-sheet 🎉</Text>
      </BottomSheetView>
    </Sheet>
  );
}
