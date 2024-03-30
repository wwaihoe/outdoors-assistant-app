import styles from "../page.module.css";

import { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, MapControl, ControlPosition } from "@vis.gl/react-google-maps";
import { Polygon } from './polygon';
import { OutdoorSpot } from "../page"
import type { FeatureCollection } from "geojson";
import { DengueClustersGEOJSON } from "../../public/data/DengueClusters";
import { FacilitiesGEOJSON } from "../../public/data/Facilities";
import GoogleMapsFoodPlaces from "./GoogleMapsFoodPlaces";


interface GoogleMapsProps {
  lat: number; 
  lng: number;
  zoom: number;
  handleclick: (spot: OutdoorSpot)=>void;
  markers: OutdoorSpot[];
  setdenguewarning: (dengueWarning: number)=>void;
}

interface Coordinates {
  lat: number;
  lng: number;
}

export default function GoogleMaps(props: GoogleMapsProps) {
  const [currInfo, setCurrInfo] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [foodPlaces, setFoodPlaces] = useState<google.maps.places.PlaceResult[]>([]);
  const parseDescription = (description: string) => {
    // Parse HTML description and extract relevant information
    const parser = new DOMParser();
    const doc = parser.parseFromString(description, 'text/html');
    const thElements = doc.querySelectorAll('th');
    let nameValue = '';
    thElements.forEach(thElement => {
      if (thElement.textContent?.trim() === 'NAME') {
        const tdElement = thElement.nextElementSibling;
        if (tdElement) {
          nameValue = tdElement.textContent?.trim() as string;
        }
      }
    });
    return nameValue;
  };
  useEffect(() => {
    if (props.zoom > 15) {
      setShowDetails(true);
      let count = 0;
      (DengueClustersGEOJSON as FeatureCollection).features.map((cluster: any) => {
        let polyLat = 0;
        let polyLng = 0;
        const coordinates = cluster.geometry.coordinates[0];
        for (let i = 0; i < coordinates.length; i++) {
          polyLat += coordinates[i][1];
          polyLng += coordinates[i][0];
        }
        polyLat /= coordinates.length;
        polyLng /= coordinates.length;
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(props.lat as number, props.lng as number),
          new google.maps.LatLng(polyLat, polyLng)
        );
        if (distance <= 1000) {
          count++;
        }
      });
      props.setdenguewarning(count);
      }
    else {
      setShowDetails(false);
      setFoodPlaces([]);
    }
  }, [props.zoom]);

  return (
    <div className={styles.map}>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
        <GoogleMapsFoodPlaces setfoodplaces={setFoodPlaces} showdetails={showDetails} lat={props.lat} lng={props.lng}/>
        <Map
          id={"defaultMap"}
          mapId={"defaultMap"}
          center={{lat: props.lat, lng: props.lng}}
          zoom={props.zoom}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        >
          <MapControl position={ControlPosition.TOP_LEFT}></MapControl>
          {props.markers.map((spot) => (
            <div key={spot.name}>
              <AdvancedMarker position={{lat: spot.lat, lng: spot.lng}} onClick={() => props.handleclick(spot)}>
                <Pin background={'#48e173'} glyphColor={'#ffffff'} borderColor={'#ffffff'} />
              </AdvancedMarker>
            </div>
          ))}
          {(DengueClustersGEOJSON as FeatureCollection).features.map((cluster: any) => (
              <Polygon
                key={cluster.properties.Name}
                paths={cluster.geometry.coordinates[0].map((coord: any) => ({lat: coord[1], lng: coord[0]}))}
                fillColor={'#fdfd96'}
                strokeColor={'#ffff00'}
              />
            ))
          }
          {(FacilitiesGEOJSON as FeatureCollection).features.map((facility: any) => (
            showDetails && <AdvancedMarker key={facility.properties.Name} position={{lat: facility.geometry.coordinates[1], lng: facility.geometry.coordinates[0]}} onClick={() => setCurrInfo(facility.properties.Name)}>
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
            (currInfo === facility.properties.Name) && <InfoWindow key={facility.properties.Name} position={{lat: facility.geometry.coordinates[1], lng: facility.geometry.coordinates[0]}}>
              <p className={styles.infoWindowText}>{parseDescription(facility.properties.Description)}</p>
            </InfoWindow>
          ))}
          {foodPlaces.map((place: google.maps.places.PlaceResult) => (
            showDetails && <AdvancedMarker key={place.name} position={{lat: place.geometry?.location?.lat() as number, lng: place.geometry?.location?.lng() as number}} onClick={() => setCurrInfo(place.name as string)}>
              <Pin background={'#f58d42'} glyphColor={'#ffffff'} borderColor={'#ffffff'} />
            </AdvancedMarker>
          ))}
          {foodPlaces.map((place: google.maps.places.PlaceResult) => (
            (currInfo === place.name) && <InfoWindow key={place.name} position={{lat: place.geometry?.location?.lat() as number, lng: place.geometry?.location?.lng() as number}}>
              <div className={styles.infoWindowText}>
                <h3>{place.name}</h3>
                <p>Rating: {place.rating}</p>
                <p>Price level: {place.price_level}</p>
                <p>{place.formatted_address}</p>
                <p><a href={place.url}>View on Google Maps</a></p>
              </div>
            </InfoWindow>
          ))}
        </Map>        
      </APIProvider>
    </div>
  )
}

//facility.properties.Description.split("<td>")[2].split("<\/td>")[0]