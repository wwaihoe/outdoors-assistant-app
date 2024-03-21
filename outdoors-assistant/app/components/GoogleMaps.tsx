import styles from "../page.module.css";

import {APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import {OutdoorSpot} from "../page"


interface GoogleMapsProps {
  lat: number; 
  lng: number;
  zoom: number;
  handleclick: (spot: OutdoorSpot)=>void;
  markers: OutdoorSpot[];
}

export default function GoogleMaps(props: GoogleMapsProps) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
      <div className={styles.map}>
        <Map
          mapId={"defaultMap"}
          center={{lat: props.lat, lng: props.lng}}
          zoom={props.zoom}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        >
          {props.markers.map((spot) => (
            <div key={spot.name}>
              <AdvancedMarker position={{lat: spot.lat, lng: spot.lng}} onClick={() => props.handleclick(spot)}>
                <Pin background={'#48e173'} glyphColor={'#ffffff'} borderColor={'#ffffff'} />
              </AdvancedMarker>
            </div>
          ))}
        </Map>
      </div>
    </APIProvider>
  )
}