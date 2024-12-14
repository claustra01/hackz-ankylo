import Map from '../features/game-future/components/Map'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function App() {
  return (
    <Canvas style={{ width: '100vw', height: '100vh' }}>
      <Map />
      <OrbitControls />
    </Canvas>
  )
}

export default App