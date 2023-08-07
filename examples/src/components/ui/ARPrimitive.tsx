import * as React from 'react'
//import { useLoader } from '@react-three/fiber'

import { GLTFLoader, DRACOLoader } from 'three-stdlib';
//import {ARObj} from '../../../../src/ARLocation';
import { Interactive, ARObj } from '@react-three/xr'
import * as THREE from "three";

const DEFAULT_DRACO_PROFILE_PATH = 'assets/three/examples/jsm/libs/draco/'

export interface ARPimitiveProps {
  distance: boolean,
  loadModel: boolean,
  filePath?:string,
  arObject:ARObj,
  maxDistance?: number,
  children?: React.ReactNode
  ShowModal?:any
}

export function ARPrimitive (props: ARPimitiveProps) {

  const [loadedModel, setLoadedModel] = React.useState(null);
  const [maxDistance, setMaxDistance] = React.useState(props.maxDistance? props.maxDistance : 50);
 
  React.useEffect(() => {
    // load model:
    if(props.loadModel && props.filePath) {
      if(loadedModel) {return;}
      //console.log("useEffect LAOD", loadedModel)
      const glftLoader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath( DEFAULT_DRACO_PROFILE_PATH );
      glftLoader.setDRACOLoader( dracoLoader );

      glftLoader.load(props.filePath, (gltfScene) => {
        //@ts-ignore
        setLoadedModel(gltfScene);
       
      });
    } 

  }, [props.loadModel, props.filePath,loadedModel])

  const RenderChildren = () => {
    // console.log("primitive box", props.position)
    if(!props.children) return <></>
    
    return (
      <>
      {
        React.Children.map(props.children, (child) => {
          // @ts-ignore
          return React.cloneElement(child, {
            position: props.arObject.position,
          });
        })
      }
      </>
    );
  };

  const RenderModel=() =>{
    // const model = useLoader(GLTFLoader, props.filePath!, loader => {
    //   const dracoLoader = new DRACOLoader();
    //   dracoLoader.setDecoderPath(DEFAULT_DRACO_PROFILE_PATH);
    //   loader.setDRACOLoader(dracoLoader);
    //  });
    
    console.log("render model " + props.arObject.name, props.arObject.distance, " dis ", maxDistance)
   if(loadedModel == null) return (<></>)
    if(!props.distance || (props.arObject.distance && props.arObject.distance < maxDistance)) {

      const onSelect = () => {
        props.ShowModal(props.arObject.name);
       // setShowModal(true);
      }

      return(
      //   <mesh position={props.arObject.position}>
      //   <boxGeometry args={[.5,.5,.5]} />
      //   <meshPhongMaterial color={'red'} />
      //   </mesh>
      // )
      <group>
       
      <Interactive onSelect={onSelect}>
        <primitive 
         //@ts-ignore
          object={loadedModel.scene}
          scale={props.arObject.scale}
          position={props.arObject.position}
        />
        </Interactive>
    
      </group>
     
     );

    }
    return (<></>)
  }


  return(
    <>
    {props.loadModel && props.filePath ? 
    <RenderModel />
    :( <RenderChildren /> )
    }
    </>
  )

}

