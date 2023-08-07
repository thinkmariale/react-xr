
import  { useState } from 'react'
import {  Interactive } from '@react-three/xr'
import * as THREE from "three";

function Box({ color, size, scale, children, ...rest }: any) {
console.log("rest", rest)
 return (
   <mesh scale={scale} {...rest}>
     <boxGeometry args={size} />
     <meshPhongMaterial color={color} />
     {children}
   </mesh>
 )
}

function BoxButton(props: any) {
 const [hover, setHover] = useState(false)
 const [color, setColor] = useState<any>('blue')

 const onSelect = () => {
   setColor((Math.random() * 0xffffff) | 0)
 }

 return (
  //  <Interactive onHover={() => setHover(true)} onBlur={() => setHover(false)} onSelect={onSelect}>
     <Box color={color} scale={hover ? [0.6, 0.6, 0.6] : [0.5, 0.5, 0.5]} size={[0.4, 0.1, 0.1]} {...props}>
      
     </Box>
  //  </Interactive>
 )
}

export default BoxButton