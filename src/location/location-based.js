import { SphMercProjection } from "./sphmerc-projection.js";
import * as THREE from "three";

export class LocationBased {
  // constructor(scene, camera, options = {}) {
  //   this._scene = scene;
  //   this._camera = camera;
  constructor( options = {}) {
    // this._scene = scene;
    // this._camera = camera;
    this._proj = new SphMercProjection();
    this._eventHandlers = {};
    this._lastCoords = null;
    this._gpsMinDistance = 5;
    this._gpsMaxDistance = 40;
    this._gpsMinAccuracy = 60;
    this._maximumAge = 0;
    this._watchPositionId = null;
    this.setGpsOptions(options);
    this.initialPosition = null;
    this.initialPositionAsOrigin = options.initialPositionAsOrigin || false;
    console.log("LocationBased init", options.name)
  }

  setProjection(proj) {
    this._proj = proj;
  }

  setGpsOptions(options = {}) {
    if (options.gpsMinDistance !== undefined) {
      this._gpsMinDistance = options.gpsMinDistance;
    }
    if (options.gpsMinAccuracy !== undefined) {
      this._gpsMinAccuracy = options.gpsMinAccuracy;
    }
    if (options.maximumAge !== undefined) {
      this._maximumAge = options.maximumAge;
    }
  }

  initLocation(scene, camera) {
    this._scene = scene;
    this._camera = camera;
  }
  startGps(maximumAge = 0) {
    if (this._watchPositionId === null) {
      console.log("startGps started")
      this._watchPositionId = navigator.geolocation.watchPosition(
        (position) => {
          this._gpsReceived(position);
        },
        (error) => {
          if (this._eventHandlers["gpserror"]) {
            this._eventHandlers["gpserror"](error.code);
          } else {
            alert(`GPS error: code ${error.code}`);
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: maximumAge != 0 ? maximumAge : this._maximumAge,
        }
      );
      return true;
    }
    console.warn("Location did not start")
    return false;
  }

  stopGps() {
    if (this._watchPositionId !== null) {
      console.log("stopGps stopped")
      navigator.geolocation.clearWatch(this._watchPositionId);
      this._watchPositionId = null;
      return true;
    }
    return false;
  }

  fakeGps(lon, lat, elev = null, acc = 0) {
    if (elev !== null) {
      this.setElevation(elev);
    }

    this._gpsReceived({
      coords: {
        longitude: lon,
        latitude: lat,
        accuracy: acc,
      },
    });
  }

  lonLatToWorldCoords(lon, lat) {
    const projectedPos = this._proj.project(lon, lat);
    if (this.initialPositionAsOrigin) {
      if (this.initialPosition) {
        projectedPos[0] -= this.initialPosition[0];
        projectedPos[1] -= this.initialPosition[1];
      } else {
        throw "Trying to use 'initial position as origin' mode with no initial position determined";
      }
    }
    return [projectedPos[0], -projectedPos[1]];
  }

  add(object, lon, lat, elev) {
    this.setWorldPosition(object, lon, lat, elev);
    this._scene.add(object);
  }

  setWorldPosition(object, lon, lat, elev) {
    console.log("setWorldPosition", lon, lat, )
    const worldCoords = this.lonLatToWorldCoords(lon, lat);
    console.log("setWorldPosition worldCoords",worldCoords )
    if (elev !== undefined) {
      object.position.y = elev;
    }
    [object.position.x, object.position.z] = worldCoords;
  }
  setWorldPositionObj(lon, lat, elev) {
    //console.log(lon, lat, elev)
    const worldCoords = this.lonLatToWorldCoords(lon, lat);
    let y = 0;
    if (elev !== undefined) {
      y = elev;
    }
    return [worldCoords[0], y, worldCoords[1]] 
  }
  setElevation(elev) {
    this._camera.position.y = elev;
  }

  on(eventName, eventHandler) {
    this._eventHandlers[eventName] = eventHandler;
  }

  setWorldOrigin(lon, lat) {
    this.initialPosition = this._proj.project(lon, lat);
  }

  _gpsReceived(position) {
  //  console.log("startGps position", position)
    let distMoved = Number.MAX_VALUE;
    
    if (position.coords.accuracy <= this._gpsMinAccuracy) {
      if (this._lastCoords === null) {
        this._lastCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      } else {
        distMoved = this._haversineDist(this._lastCoords, position.coords);
      }
      if ((distMoved == Number.MAX_VALUE) || (distMoved >= this._gpsMinDistance && distMoved < this._gpsMaxDistance))
      {
        this._lastCoords.longitude = position.coords.longitude;
        this._lastCoords.latitude = position.coords.latitude;
        if (this.initialPositionAsOrigin && !this.initialPosition) {
          console.log("set init position as origin")
          this.setWorldOrigin(
            position.coords.longitude,
            position.coords.latitude
          );
        }
        // this.setWorldPosition(
        //   this._camera,
        //   position.coords.longitude,
        //   position.coords.latitude
        // );
        // console.log("camera move:", distMoved)
        // console.log("sence move:", this._scene)
        if (this._eventHandlers["gpsupdate"]) {
          this._eventHandlers["gpsupdate"](position, distMoved);
        } else{
          console.log("no handler")
        }
      } 
    //  else { console.log("fail move distance",distMoved)}
    } 
    else {
      console.log("ACCCURACY BAD")
    }
  }

  /**
   * Calculate haversine distance between two lat/lon pairs.
   *
   * Taken from original A-Frame components
   */
  _haversineDist(src, dest) {
   
    const dlongitude = THREE.MathUtils.degToRad(dest.longitude - src.longitude);
    const dlatitude = THREE.MathUtils.degToRad(dest.latitude - src.latitude);

    const a =
      Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2) +
      Math.cos(THREE.MathUtils.degToRad(src.latitude)) *
        Math.cos(THREE.MathUtils.degToRad(dest.latitude)) *
        (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
    const angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return angle * 6371000;
  }
}


