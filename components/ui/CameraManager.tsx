import { useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import { CameraView, type BarcodeScanningResult, FlashMode } from "expo-camera"

interface CameraManagerProps {
  isActive: boolean
  flashOn: boolean
  isScanning: boolean
  onBarcodeScanned: (result: BarcodeScanningResult) => void
}

export default function CameraManager({ isActive, flashOn, isScanning, onBarcodeScanned }: CameraManagerProps) {
  const [key, setKey] = useState(0)

  // Force camera remount when active state changes
  useEffect(() => {
    if (isActive) {
      // Small delay to ensure proper initialization
      setTimeout(() => {
        setKey((prevKey) => prevKey + 1)
      }, 300)
    }
  }, [isActive])

  if (!isActive) {
    return null
  }

  return (
    <CameraView
      key={`camera-view-${key}`}
      style={StyleSheet.absoluteFillObject}
      facing="back"
      flash={flashOn ? "on" : "off"}
      onBarcodeScanned={isScanning ? onBarcodeScanned : undefined}
    />
  )
}