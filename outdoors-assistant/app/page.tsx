"use client"

import styles from "./page.module.css";
import NavBar from "./components/NavBar";
import GoogleMaps from "./components/GoogleMaps";
import { useState, useEffect } from "react";
import { IconStarFilled } from '@tabler/icons-react';
import SeeReviews from "./components/SeeReviews";
import AddReview from "./components/AddReview";
import { submitReview } from "./components/addReviewAction";
import { useUser } from '@auth0/nextjs-auth0/client';
import { outdoorPlaces } from "../public/data/OutdoorPlaces";


export default function Home() {
  const { user, error, isLoading } = useUser();
  const [coordinates, setCoordinates] = useState({lat: 1.34357, lng: 103.84422});
  const [zoom, setZoom] = useState(12);
  const [show, setShow] = useState<"Home" | "Details" | "Review" | "SeeReviews">("Home");
  const [spots, setSpots] = useState<OutdoorSpot[]>(outdoorPlaces);
  const [currSpot, setCurrSpot] = useState<OutdoorSpot>(outdoorPlaces[0]);
  const [dengueWarning, setDengueWarning] = useState<number>(0);

  useEffect(() => {
    console.log("Fetching ratings");
    for (let i = 0; i < spots.length; i++){
      let initials = spots[i].name.replace(/[^A-Z]+/g, "");
      fetch(`http://localhost:3003/reviews/${initials}/average`)
        .then((res) => res.json())
        .then((data) => {
          spots[i].rating = data.average_rating;
        })
    }
  }, [show, spots])

  const handleClick = (spot: OutdoorSpot) => {
    setCurrSpot(spot);
    setShow("Details");
    setZoom(15.5);
    setCoordinates({lat: spot.lat, lng: spot.lng});
  }
  const handleBackClick = () => {
    setShow("Home");
    setZoom(12);
    setCoordinates({lat: 1.34357, lng: 103.84422});
  }
  const handleReviewClick = (spot: OutdoorSpot) => {
    setShow("Review");
  }
  const handleSeeReviewsClick = () => {
    setShow("SeeReviews");
  }
  const handleSubmitReviewClick = (rating: number, description: string) => {
    submitReview(user?.email as string, currSpot.name, rating, description);
    setShow("Home");
  }

  return (
    <main className={styles.main}>
      <NavBar/>
      <div className={styles.center}> 
        <GoogleMaps lat={coordinates.lat} lng={coordinates.lng} zoom={zoom} handleclick={handleClick} markers={spots} setdenguewarning={setDengueWarning}/>
        <OutdoorSpotsList outdoorspots={spots} show={show} currspot={currSpot} denguewarning={dengueWarning} handleclick={handleClick} handlebackclick={handleBackClick} handlereviewclick={handleReviewClick} handleseereviewsclick={handleSeeReviewsClick} handlesubmitreviewclick={handleSubmitReviewClick}/>
      </div>
    </main>
  );
}


export interface OutdoorSpot {
  name: string;
  lat: number;
  lng: number;
  rating: number | null;
}

interface OutdoorSpotsListProps {
  outdoorspots: OutdoorSpot[];
  show: "Home" | "Details" | "Review" | "SeeReviews";
  currspot: OutdoorSpot;
  denguewarning: number;
  handleclick: (spot:OutdoorSpot)=>void; 
  handlereviewclick: (spot:OutdoorSpot)=>void;
  handlebackclick: ()=>void;    
  handleseereviewsclick: ()=>void;
  handlesubmitreviewclick: (rating: number, description: string)=>void;
}

function OutdoorSpotsList(props: OutdoorSpotsListProps) {
  if (props.show === "Home") {
    return (
      <div className={styles.box}>
        <div className={styles.boxHeader}>
          <h2>Outdoor Spots</h2>
        </div>
        <div className={styles.list}>
          {props.outdoorspots.map((spot) => (
            <div className={styles.spotEntry} key={spot.name} onClick={() => props.handleclick(spot)}>
              <h3>{spot.name}</h3>
              <div className={styles.rating}>
                <p className={styles.ratingText}>{spot.rating?.toFixed(2)}</p>
                {spot.rating !== null ? <IconStarFilled /> : <p>No ratings</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (props.show === "Details") {
    return (
      <div className={styles.box}>
        <OutdoorSpotDetails outdoorspot={props.currspot} denguewarning={props.denguewarning} handlebackclick={props.handlebackclick} handleseereviewsclick={props.handleseereviewsclick}></OutdoorSpotDetails>
      </div>
    )  
  }

  if (props.show === "Review") {
    return (
      <div className={styles.box}>
        <AddReview outdoorspot={props.currspot} handlebackclick={props.handlebackclick} handlesubmitreviewclick={props.handlesubmitreviewclick} ></AddReview>
      </div>
    )
  }

  if (props.show === "SeeReviews") {
    return (
      <div className={styles.box}>
        <SeeReviews outdoorspot={props.currspot} handlereviewclick={props.handlereviewclick} handlebackclick={props.handlebackclick} ></SeeReviews>
      </div>
    )
  }
}


interface OutdoorSpotDetailsProps {
  outdoorspot: OutdoorSpot;
  denguewarning: number;
  handlebackclick: ()=>void;
  handleseereviewsclick: ()=>void;
}

function OutdoorSpotDetails(props: OutdoorSpotDetailsProps) {
  
  return (
    <div className={styles.detailsBox}>
      <div className={styles.detailsBoxMain}>
        <h2 className={styles.boxHeader}>{props.outdoorspot.name}</h2>
        <div className={styles.details}>
          <div className={styles.rating}>
            <p className={styles.ratingText}>{props.outdoorspot.rating?.toFixed(2)}</p>
            {props.outdoorspot.rating !== null ? <IconStarFilled /> : <p>No ratings</p>}
            <button className={styles.seeReviewsButton} onClick={props.handleseereviewsclick} >see reviews</button>
          </div>
          <p style={{color: "lightgray", fontSize: "16px", marginBottom: "2rem"}}>Click on the green marker to view nearby food places</p>
          <p>{props.denguewarning > 0 ? props.denguewarning + ' Dengue clusters nearby' : 'No dengue clusters nearby!'}</p>
        </div>
      </div>
      
      <div className={styles.controls}>
        <button className={styles.redButton} onClick={props.handlebackclick}>Back</button>
      </div>
    </div>
  )
}

