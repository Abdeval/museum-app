import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { Canvas } from "@react-three/fiber/native"
import { Suspense, useRef, useState, useCallback } from "react"
import { useGLTF, OrbitControls, Environment } from "@react-three/drei/native"
import { Ionicons } from "@expo/vector-icons"
import * as THREE from "three"
import { COLORS } from "@/constants/Colors"
import { useColorScheme } from "@/lib/useColorScheme"

interface Model3DViewerProps {
  modelUrl: string
  title?: string
  height?: number
  enableControls?: boolean
  autoRotate?: boolean
}

// 3D Model Component
function Model({ url, autoRotate = false }: { url: string; autoRotate?: boolean }) {
  const { scene } = useGLTF(url)
  const meshRef = useRef<THREE.Group>(null)

  // Center and scale the model
  const centerModel = useCallback(() => {
    if (meshRef.current) {
      const box = new THREE.Box3().setFromObject(meshRef.current)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())

      // Center the model
      meshRef.current.position.sub(center)

      // Scale to fit in view
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 2 / maxDim
      meshRef.current.scale.setScalar(scale)
    }
  }, [])

  return <primitive ref={meshRef} object={scene} onUpdate={centerModel} />
}

// Loading Component
function ModelLoader() {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color={COLORS.light.primary} />
      <Text className="text-foreground mt-2">Loading 3D Model...</Text>
    </View>
  )
}

// Error Fallback Component
function ModelError({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100 dark:bg-gray-800">
      <Ionicons name="cube-outline" size={50} color="#999" />
      <Text className="text-gray-500 mt-2 text-center">Failed to load 3D model</Text>
      <TouchableOpacity onPress={onRetry} className="mt-3 bg-primary px-4 py-2 rounded-lg">
        <Text className="text-white">Retry</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function Model3DViewer({
  modelUrl,
  title,
  height = 400,
  enableControls = true,
  autoRotate = false,
}: Model3DViewerProps) {
  const { colorScheme } = useColorScheme()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const controlsRef = useRef<any>(null)

  const handleError = useCallback(() => {
    setHasError(true)
    setIsLoading(false)
  }, [])

  const handleRetry = useCallback(() => {
    setHasError(false)
    setIsLoading(true)
  }, [])

  const resetView = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }, [])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  const showControls = useCallback(() => {
    Alert.alert(
      "3D Model Controls",
      "• Drag to rotate\n• Pinch to zoom\n• Two fingers to pan\n• Tap reset to center view",
      [{ text: "Got it!" }],
    )
  }, [])

  if (hasError) {
    return (
      <View style={{ height }} className="rounded-lg overflow-hidden">
        <ModelError onRetry={handleRetry} />
      </View>
    )
  }

  return (
    <View className="mb-6">
      {title && (
        <View className="flex-row items-center justify-between mb-2 px-4">
          <Text className="text-lg font-bold text-foreground">{title}</Text>
          <TouchableOpacity onPress={showControls}>
            <Ionicons name="help-circle-outline" size={24} color={COLORS[colorScheme].primary} />
          </TouchableOpacity>
        </View>
      )}

      <View
        style={{ height: isFullscreen ? "100%" : height }}
        className={`rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 ${
          isFullscreen ? "absolute inset-0 z-50" : ""
        }`}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} onCreated={() => setIsLoading(false)}>
          <Suspense fallback={null}>
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} />

            {/* Environment for reflections */}
            <Environment preset="studio" />

            {/* 3D Model */}
            <Model url={modelUrl} autoRotate={autoRotate} />

            {/* Controls */}
            {enableControls && (
              <OrbitControls
                ref={controlsRef}
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                autoRotate={autoRotate}
                autoRotateSpeed={2}
                minDistance={1}
                maxDistance={10}
                minPolarAngle={0}
                maxPolarAngle={Math.PI}
              />
            )}
          </Suspense>
        </Canvas>

        {/* Loading Overlay */}
        {isLoading && (
          <View className="absolute inset-0 bg-white/80 dark:bg-black/80">
            <ModelLoader />
          </View>
        )}

        {/* Control Buttons */}
        <View className="absolute top-4 right-4 flex-col space-y-2">
          <TouchableOpacity onPress={resetView} className="bg-black/50 rounded-full p-2">
            <Ionicons name="refresh" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleFullscreen} className="bg-black/50 rounded-full p-2">
            <Ionicons name={isFullscreen ? "contract" : "expand"} size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Fullscreen Close Button */}
        {isFullscreen && (
          <TouchableOpacity
            onPress={() => setIsFullscreen(false)}
            className="absolute top-4 left-4 bg-black/50 rounded-full p-2"
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Model Info */}
      <View className="mt-2 px-4">
        <Text className="text-sm text-gray-500">Drag to rotate • Pinch to zoom • Two fingers to pan</Text>
      </View>
    </View>
  )
}

// Preload models for better performance
export const preloadModel = (url: string) => {
  useGLTF.preload(url)
}
