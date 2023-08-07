
import * as THREE from "three";

export interface ICoordinates {
  latitude: number;
  longitude: number;
}
export const EARTH_RADIUS = 6378137  // Earth's radius in meters

/**
 * Convert an angle in degrees into an angle in radians
 * @param {number} angle   An angle in degrees
 * @return {number} Returns an angle in radians
 */
export function degToRad (angle: number):number {
  return angle * Math.PI / 180
}

/**
 * Convert an angle in radians into an angle in degrees
 * @param {number} angle  An angle in radians
 * @return {number} Returns an angle in degrees
 */
export function radToDeg (angle:number):number {
  return angle * 180 / Math.PI
}


/**
* Calculate the bearing between two positions as a value from 0-360
*
* @param {Location} from Start location
* @param {Location} to  End location
*
* @return int - The bearing between 0 and 360
*/
export function calcDegreeToPoint (from: ICoordinates, to: ICoordinates) {
  const phiK = degToRad(to.latitude);
  const lambdaK = degToRad(to.longitude);

  const phi = degToRad(from.latitude);
  const lambda = degToRad(from.longitude)

  const psi = radToDeg(Math.atan2( Math.sin(lambdaK - lambda), Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda) ));

  return Math.round(psi);
}

/**
* Calculate the bearing between two positions as a value from 0-360
*
* @param {Location} from Start location
* @param {Location} to  End location
*
* @return int - The bearing between 0 and 360
*/
export function angleBtwPoints (from: ICoordinates, to: ICoordinates) {
  const dLon:number = (to.longitude - from.longitude);
  const dLat:number = (to.latitude - from.latitude);

  const angleRadians:number = Math.atan2(dLon, dLat);
  const angleDeg:number = radToDeg(angleRadians);

  return {angleRadians, angleDeg};
}

/**
 * Calculate the heading and distance between two locations
 *
 * Sources:
 * 
 *   http://www.movable-type.co.uk/scripts/latlong.html
 *   http://mathforum.org/library/drmath/view/55417.html
 * 
 * @param {Location} from Start location
 * @param {Location} to  End location
 * @return {HeadingDistance}  Returns an object with `heading` in degrees and `distance` in meters
 */
export function headingDistanceTo (from: ICoordinates, to: ICoordinates) {
 
  const lat1:number = degToRad(from.latitude);
  const lat2:number = degToRad(to.latitude);
  const dlat:number = degToRad(to.latitude - from.latitude);
  const dlon:number = degToRad(to.longitude - from.longitude);

  const a:number = Math.sin(dlat/2) * Math.sin(dlat/2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon/2) * Math.sin(dlon/2);
  const c:number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance:number = EARTH_RADIUS * c;

  const y:number = Math.sin(dlon) * Math.cos(lat2);
  const x:number = Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dlon);
  const heading:number = radToDeg(Math.atan2(y, x));

  return { distance, heading }
}

export const calcPosFromLatLonRad = (point:ICoordinates, radius:number) => {

  
  let phi = (90 - point.latitude) * (Math.PI / 180);
  let theta = (point.longitude + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  //console.log([x, y, z]);
  return [x, y, z];
};

export function calcPosFromLatLonRadThree(point:ICoordinates, radius:number) {

  let spherical = new THREE.Spherical(
    radius,
    degToRad(90 - point.longitude),
    degToRad(point.latitude)
  );

  let vector = new THREE.Vector3();
  vector.setFromSpherical(spherical);

  //console.log(vector.x, vector.y, vector.z);
  return vector;
}

export function repositionPoint(point:ICoordinates, home:ICoordinates) {
  const R = 6371 * 1000;   // Earth radius in m
  const circ = 2 * Math.PI * R;  // Circumference
  const phi = 90 - point.latitude;
  const theta = point.longitude - home.longitude;
  const thetaPrime = home.latitude / 180 * Math.PI;
  const x = R * Math.sin(theta / 180 * Math.PI) * Math.sin(phi / 180 * Math.PI);
  const y = R * Math.cos(phi / 180 * Math.PI);
  const z = R * Math.sin(phi / 180 * Math.PI) * Math.cos(theta / 180 * Math.PI);
  const abs = Math.sqrt(z**2 + y**2);
  const arg = Math.atan(y / z) - thetaPrime;

  return [x.toFixed(3), 0, (Math.sin(arg) * abs).toFixed(3)];
}