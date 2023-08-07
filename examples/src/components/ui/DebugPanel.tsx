import {
  XRConsoleFactory
  } from '@react-three/xr'

function DebugPanel() {

  const xrConsole = XRConsoleFactory.getInstance().createConsole({
    pixelWidth: 1024,
    pixelHeight: 512,
    actualWidth: 2,
    actualHeight: 1,
  });
  console.log("debug panel render")

  return (
    <primitive object={xrConsole} scale={[.5,.5,.5]} position={[0,-.1,-.7]}/>
  )
 }
 
 export default DebugPanel