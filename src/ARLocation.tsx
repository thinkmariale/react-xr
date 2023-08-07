import * as React from 'react'
import * as THREE from 'three'
import { useThree, useFrame } from '@react-three/fiber'
import { useXR } from './XR'
import {repositionPoint, calcPosFromLatLonRad, calcPosFromLatLonRadThree, EARTH_RADIUS} from './location/utils'

export interface ARObj {
  position:[number, number, number],
  arPosition:[number, number, number],
  scale:[number, number, number],
  name:string,
  distance?:number
}
export interface ARLocationProps {
  setArObjects: any,
  arObjects: ARObj[],
  children: React.ReactNode
}

export function ARLocation(props:ARLocationProps) {
 
 //const camera = useThree((state) => state.camera)
  const scene = useThree((state) => state.scene)
  const player = useXR((state) => state.player)

  //const raycaster = useThree((state) => state.raycaster)
  const startLocatonInteraction = useXR((state) => state.startLocatonInteraction)
  const locationBased = useXR((state) => state.locationBased)
  const arLocationControl = useXR((state) => state.arLocationControl)

  const [initLocation, setInitLocation] = React.useState(false);
  const [initPos, setInitPos] = React.useState(false);
  const stateRef = React.useRef<boolean>();
  stateRef.current = initPos;

 //@ts-ignore
 const handleUpdate = (pos) => { 
  
  setInitLocation(true);
 // console.log('handleUpdate', props.arObjects.length, stateRef.current)
  if(!arLocationControl || stateRef.current) {return}
  let allpos= []
  for(let i = 0; i < props.arObjects.length;i++) {
    const element = props.arObjects[i];
   // const newpos = arLocationControl.setWorldPositionObj(element.position[1],element.position[0],element.position[2])
    const distance = arLocationControl._haversineDist(pos.coords, {longitude:element.arPosition[1], latitude:element.arPosition[0]});
   // const distance = headingDistanceTo(pos.coords, {longitude:element.position[1], latitude:element.position[0]});
    const newpos = repositionPoint({longitude:element.arPosition[1], latitude:element.arPosition[0]}, pos.coords)
    console.log("distance", distance, element.name, newpos)
    allpos.push({...element, position:newpos, distance:distance});
  }

  setInitPos(true);
  props.setArObjects(allpos)
 }


  React.useEffect(() => {

    if(!locationBased || initLocation) {return;}
    if (!arLocationControl) { 
     console.log("arLocationControl null" )
     return 
    }
    else {
     console.log("use effect ARLocation")
     const res = startLocatonInteraction(player, scene);
      if(res) {
        console.log("startLocatonInteraction gps callbacks" )
        //@ts-ignore
        arLocationControl.on("gpsupdate", handleUpdate.bind(this));
    
        //@ts-ignore
        arLocationControl.on("gpserror", code => {
          alert(`GPS error: code ${code}`);
          //console.warn(`GPS error: code ${code}`)
          // onGpsError();
        });
      }
    }
  },)

  // Trigger hover and blur events
  // useFrame(() => {
   
  // })

  const ARObjects = () => {
    // if its location based and location hasn`t started dont show anything for now.
    if(locationBased && !initLocation) {
      <></>
    }
    return <>{props.children}</>
  }

  return <ARObjects/>
}

