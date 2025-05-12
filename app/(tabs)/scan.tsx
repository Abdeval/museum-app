import React, { useState, useEffect } from "react";
import { Text, View, Button } from "react-native";
import { CameraView, Camera } from "expo-camera";

export default function Scan() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text className="text-center text-lg text-gray-700">Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text className="text-center text-lg text-red-500">No access to camera</Text>;
  }

  return (
    <View className="flex-1 relative justify-center items-center bg-black">
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        className="absolute inset-0"
      />
      {scanned && (
        <View className="absolute bottom-12">
          <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}
