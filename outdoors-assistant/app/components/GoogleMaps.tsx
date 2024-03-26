import styles from "../page.module.css";

import { useState, useEffect } from "react";
import {APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { Polygon } from './polygon';
import { OutdoorSpot } from "../page"
import type { FeatureCollection } from "geojson";
import { DengueClustersGEOJSON } from "../../public/data/DengueClusters";
import { FacilitiesGEOJSON } from "../../public/data/Facilities";
  

interface GoogleMapsProps {
  lat: number; 
  lng: number;
  zoom: number;
  handleclick: (spot: OutdoorSpot)=>void;
  markers: OutdoorSpot[];
}

interface Coordinates {
  lat: number;
  lng: number;
}

export default function GoogleMaps(props: GoogleMapsProps) {
  const [currInfo, setCurrInfo] = useState<string | null>(null);
  const [showFacilities, setShowFacilities] = useState(false);
  useEffect(() => {
    props.zoom > 15 ? setShowFacilities(true) : setShowFacilities(false)
  }, [showFacilities, props.zoom])

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
          {(DengueClustersGEOJSON as FeatureCollection).features.map((cluster: any) => (
              <Polygon
                paths={cluster.geometry.coordinates[0].map((coord: any) => ({lat: coord[1], lng: coord[0]}))}
                fillColor={'#fdfd96'}
                strokeColor={'#ffff00'}
              />
            ))
          }
          {(FacilitiesGEOJSON as FeatureCollection).features.map((facility: any) => (
            (showFacilities) && <AdvancedMarker position={{lat: facility.geometry.coordinates[1], lng: facility.geometry.coordinates[0]}} onClick={() => setCurrInfo(facility.properties.Name)}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  background: '#1dbe80',
                  border: '2px solid #0e6443',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)'
              }}></div>
              </AdvancedMarker>
            ))
          }
          {(FacilitiesGEOJSON as FeatureCollection).features.map((facility: any) => (
            (currInfo === facility.properties.Name) && <InfoWindow position={{lat: facility.geometry.coordinates[1], lng: facility.geometry.coordinates[0]}}>
              <p className={styles.infoWindowText}>{facility.properties.Description.split("<td>")[2].split("<\/td>")[0]}</p>
            </InfoWindow>
          ))}
        </Map>
      </div>
    </APIProvider>
  )
}