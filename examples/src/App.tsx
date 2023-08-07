 //@ts-ignore
 import  { useState, useRef } from 'react'
 import {
  ARObj,
  XR, 
  ARButton,
  Controllers,
  ARLocation,
  } from '@react-three/xr'

 import {demoPanel,
   demoImage,
   codePanel,
   modalTitle
  } from './styles.css'
 import { Canvas } from '@react-three/fiber'
 import * as THREE from "three";
 import DebugPanel from './components/ui/DebugPanel';
 import {ARPrimitive} from './components/ui/ARPrimitive';
 import BoxButton from './components/ui/BoxButton';


const distance = true
const useLocation = true;

 export function App() {

  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState("bc1qfw356j3zznufltwgl9r4dj2hx0ge7t3g73ug3j");
  
  const [arObjects, setArObjects] = useState<ARObj[]>(
    [
      // tahoe
    // { 
    //   arPosition: [39.3477195,-120.110304, 0],
    //   position:[0,0,0],
    //   scale:[.01, .01, .01],
    //   name:"cube",
    // },
    // {
    //   arPosition: [39.3475068,-120.1103905, 0],
    //   position:[0,0,0],
    //   scale:[.05, .05, .05],
    //   name:"far object"
    // },
    // {
    //   arPosition: [39.3475757,-120.1103537, 0],
    //   position:[2,0,0],
    //   scale:[10, 10, 10],
    //   name:"frog object"
    // },
    // SF 37.7545947, longitude: -122.4419746
    {
      arPosition: [37.7545947, -122.4419746, 0],
      position:[1,0,0],
      scale:[1,1,1],
      name:"far_1"
    },
    { 
      arPosition: [37.7545947+.0001, -122.4419746, 0],
      position:[1,0,0],
      scale:[1,1,1],
      name:"coin"
    },
    {
      arPosition: [37.7545947, -122.4419746-.0001, 0],
      position:[1.5,0,0],
      scale:[10,10,10],
      name:"pepe"
    }
    ])
 
    function ShowModal(info:string) {
      if(showModal) {
        setShowModal(false);
        return;
      }
      setShowModal(true);
    //  setModalInfo(info)
    }

    // const elementRef = useRef() // create the ref
   return (
    <>
    {showModal && 
    <div className={demoPanel} >
      <div className={modalTitle} >
        <img className={demoImage} src='./congrats.png'></img>
        <h3>Congratulations</h3>
      </div>
      <p style={{color:'#797b85', margin:'auto', fontSize:'10px'}}>
        YOUR UNLOCK IS BELOW:
      </p>
      <div className={codePanel} >
        <p style={{ fontSize:'10px'}}>
          {modalInfo}
          </p> 
      </div>
      <img className={demoImage} src='./congrats.png'></img>
      
    </div>
    }
      <ARButton locationBased={useLocation} />
      
      <Canvas
       camera={{ position: [0, 0, 0], } }>
        <XR referenceSpace="local" locationBased={useLocation}>
       
          <ambientLight />
          <DebugPanel />
          
          <ARLocation arObjects={arObjects} setArObjects={setArObjects} >
          </ARLocation>
           {/* <ARPrimitive arObject={arObjects[0]} loadModel={false} distance={distance}>
            <Button  />
           </ARPrimitive> */}

            
            {/* <ARPrimitive 
             arObject={arObjects[0]}
             loadModel={true}
             filePath={"assets/obj.glb"} 
             distance={distance}
             /> */}
           <ARPrimitive 
             arObject={arObjects[1]}
             loadModel={true}
             filePath={"assets/coin.glb"} 
             distance={distance}
             ShowModal={ShowModal}
             />
            <ARPrimitive 
             arObject={arObjects[2]}
             loadModel={true}
             filePath={"assets/pepe.glb"} 
             distance={distance}
             ShowModal={ShowModal}
             />
          
         
          <BoxButton  position={[0, 0.1, -0.2]}/>
          <Controllers />
        </XR>
      </Canvas>
    </>
   )
 }
 