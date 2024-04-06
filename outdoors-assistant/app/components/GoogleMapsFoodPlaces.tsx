import styles from "../page.module.css";

import { useState, useEffect } from "react";
import { useMap, AdvancedMarker, Pin, useMapsLibrary } from "@vis.gl/react-google-maps";
  

interface GoogleMapsFoodPlacesProps {
  setfoodplaces: (places: google.maps.places.PlaceResult[])=>void;
  showdetails: boolean;
  lat: number;
  lng: number;
}


export default function GoogleMapsFoodPlaces(props: GoogleMapsFoodPlacesProps) {
  const map = useMap("defaultMap") as google.maps.Map;
  const placesLibrary = useMapsLibrary("places") as google.maps.PlacesLibrary;
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService|null>(null);

  useEffect(() => {
    if (!placesLibrary || !map) return;
    setPlacesService(new placesLibrary.PlacesService(map));
  }, [placesLibrary, map]);

  useEffect(() => {
    if (!placesService || !props.showdetails) return;    
    const nearbyRequest  = {
      location: {lat: props.lat, lng: props.lng},
      radius: 1000, // Change the radius value to a number
      keyword: "food", // You can change this to other types like cafe, bar, etc.
    } as google.maps.places.PlaceSearchRequest;
    placesService.nearbySearch(nearbyRequest, (places, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && places !== null) {
        const foodPlacesDetails: google.maps.places.PlaceResult[] = [];
        for (let i = 0; i < places.length; i++) {
          const detailsRequest = {
            placeId: places[i].place_id,
          } as google.maps.places.PlaceDetailsRequest;
          placesService.getDetails(detailsRequest, (result, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && result !== null) {
              foodPlacesDetails.push(result);              
            }
          });
        }
        props.setfoodplaces(foodPlacesDetails);
      }
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        console.error("Failed to get food places");
        alert("Failed to get food places");
      }
    });
  }, [placesService, props.lat, props.lng, props.showdetails]);

  return (
    <></>
  )
}