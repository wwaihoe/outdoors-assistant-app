import styles from "../page.module.css";

import { useState, useEffect } from "react";
import { useMap, AdvancedMarker, Pin, useMapsLibrary } from "@vis.gl/react-google-maps";
  

interface GoogleMapsFoodPlacesProps {
  setfoodplaces: (places: google.maps.places.PlaceResult[])=>void;
  setplacedetails: (place: google.maps.places.PlaceResult)=>void;
  showdetails: boolean;
  showplaceinfo: boolean;
  currplaceid: string;
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
        props.setfoodplaces(places);
      }
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        console.error("Failed to get food places");
        alert("Failed to get food places");
      }
    });
  }, [placesService, props.lat, props.lng, props.showdetails]);

  useEffect(() => {
    if (!placesService || !props.showplaceinfo) return;
    const detailsRequest = {
      placeId: props.currplaceid,
    } as google.maps.places.PlaceDetailsRequest;
    placesService.getDetails(detailsRequest, (result, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && result !== null) {
        props.setplacedetails(result);
      }
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        console.error("Failed to get food place details");
        alert("Failed to get food place details");
      }
    });
  }, [props.showplaceinfo, props.currplaceid]);

  return (
    <></>
  )
}