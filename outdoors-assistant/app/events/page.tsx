"use client"

import Image from "next/image";
import styles from "../page.module.css";
import NavBar from "../components/NavBar";
import GoogleMaps from "../components/GoogleMaps";
import HostEvent from "../components/HostEvent";
import { useState, useEffect } from "react";
import { OutdoorSpot } from "../page";
import { IconUsers, IconPlus, IconCrown, IconStarFilled } from '@tabler/icons-react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { hostEvent } from "../components/hostEventAction";
import { cancelEvent } from "../components/cancelEventAction";
import { joinEvent } from "../components/joinEventAction";
import { quitEvent } from "../components/quitEventAction";


const outdoorPlaces = [
  {name: "Bishan-Ang Mo Kio Park", lat: 1.3636059844137054, lng: 103.84347570917122, rating: null}, 
  {name: "Singapore Botanic Gardens", lat: 1.315291338311505, lng: 103.8162004140456, rating: null},
  {name: "Labrador Nature Reserve", lat: 1.266593151401208, lng: 103.80209914969167, rating: null},
  {name: "Lakeside Garden", lat: 1.3403288808751195, lng: 103.7245442214574, rating: null} 
]


const exlistedEvents = [
  {name: "Central meet", capacity: 5, headcount: 3, description: "Meetup in Bishan park.", outdoorSpotName: "Bishan-Ang Mo Kio Park"},
  {name: "Bishan Party", capacity: 10, headcount: 5, description: "Hangout with friends in Bishan park.", outdoorSpotName: "Bishan-Ang Mo Kio Park"}, 
  {name: "Botanic Picnic", capacity: 20, headcount: 20, description: "Local cuisine picnic at Botanic Gardens.", outdoorSpotName: "Singapore Botanic Gardens"},
  {name: "chill session", capacity: 8, headcount: 8, description: "", outdoorSpotName: "Labrador Nature Reserve"}
]

const joinedEventsNames = ["Bishan Party"]

const hostedEventsNames = ["Botanic Picnic"]


export default function Events() {
  const { user, error, isLoading } = useUser();
  const [coordinates, setCoordinates] = useState({lat: 1.34357, lng: 103.84422});
  const [zoom, setZoom] = useState(12);
  const [show, setShow] = useState<"Events" | "Details" | "EventDetails" | "HostEvent">("Events");
  const [listedEvents, setListedEvents] = useState<OutdoorEvent[]>([])
  const [currEvent, setCurrEvent] = useState(listedEvents[0])
  const eventSpotsNames = listedEvents.map(event => event.location_name);
  const eventSpots = outdoorPlaces.filter((spot) => eventSpotsNames.includes(spot.name)) as OutdoorSpot[];
  const [spots, setSpots] = useState<OutdoorSpot[]>(eventSpots);
  const [markers, setMarkers] = useState(eventSpots);
  const [currSpot, setCurrSpot] = useState<OutdoorSpot>(eventSpots[0]);

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

  useEffect(() => {
    fetch(`http://localhost:3002/events`)
      .then((res) => res.json())
      .then((data) => {
        setListedEvents(data);
      })
  }, [show])

  const handleClick = (spot: OutdoorSpot) => {
    setCurrSpot(spot);
    setShow("Details");
    setZoom(15.5);
    setCoordinates({lat: spot.lat, lng: spot.lng});
  }
  const handleEventClick = (event: OutdoorEvent) => {
    setCurrEvent(event);
    setShow("EventDetails");
  }
  const handleBackClick = () => {
    setShow("Events");
    setZoom(12);
    setCoordinates({lat: 1.34357, lng: 103.84422});
  }
  const handleHostEventClick = () => {
    setShow("HostEvent");
  }
  const handleListEventClick = (name: string, location_name: string, datetime: string, description: string, capacity: number) => {
    hostEvent(user?.email as string, name, location_name, datetime, description, capacity, 0);
    setShow("Events");
  }
  const handleCancelClick = (name: string) => {
    cancelEvent(user?.email as string, name);
    setShow("Events");
  }
  const handleJoinClick = (host_username: string, name: string) => {
    joinEvent(host_username, name, user?.email as string);
    setShow("Events");
  }
  const handleQuitClick = (host_username: string, name: string) => {
    quitEvent(host_username, name, user?.email as string);
    setShow("Events");
  }

  return (
    <main className={styles.main}>
      <NavBar/>
      <div className={styles.center}> 
        <GoogleMaps lat={coordinates.lat} lng={coordinates.lng} zoom={zoom} markers={markers} handleclick={handleClick} />
        <EventsList outdoorspots={spots} outdoorevents={listedEvents} show={show} currspot={currSpot} currevent={currEvent} handleclick={handleClick} handleeventclick={handleEventClick} handlebackclick={handleBackClick} handlehosteventclick={handleHostEventClick} handlelisteventclick={handleListEventClick} handlecancelclick={handleCancelClick} handlejoinclick={handleJoinClick} handlequitclick={handleQuitClick}/>
      </div>
    </main>
  );
}

interface OutdoorEvent {
  event_id: number;
  host_username: string;
  name: string;
  location_name: string;
  datetime: string;
  description: string;
  capacity: number;
  headcount: number;
  participants: string[];
}


interface EventsListProps {
  outdoorspots: OutdoorSpot[];
  outdoorevents: OutdoorEvent[];
  show: "Events" | "Details" | "EventDetails" | "HostEvent";
  currevent: OutdoorEvent;
  currspot: OutdoorSpot;
  handleclick: (spot: OutdoorSpot)=>void;
  handleeventclick: (event: OutdoorEvent) => void;
  handlebackclick: () => void; 
  handlehosteventclick: () => void;
  handlelisteventclick: (name: string, location_name: string, datetime: string, description: string, capacity: number) => void;
  handlecancelclick: (name: string) => void;
  handlejoinclick: (host_username: string, name: string) => void;
  handlequitclick: (host_username: string, name: string) => void;
}

function EventsList(props: EventsListProps) {
  const { user, error, isLoading } = useUser();

  if (props.show === "Events") {
    return (
      <div className={styles.box}>
        <div className={styles.boxHeader}>
          <h2>Outdoor Events</h2>
          {user? <button className={styles.addEventButton} onClick={props.handlehosteventclick}>Host Event<IconPlus color="white" size={32}/></button>: <button className={styles.addEventButtonDisabled} onClick={props.handlehosteventclick} title="You have to be logged in first" disabled>Host Event<IconPlus color="white" size={32}/></button>}
        </div>
        <div className={styles.list}>
          {props.outdoorevents.map((event) => (
          <div className={styles.eventEntry} key={event.name} onClick={() => props.handleeventclick(event)}>
            <div className={styles.eventHeader}>
              <h3>{event.name}</h3>
              <div className={styles.headcount}>
                {(hostedEventsNames.includes(event.name))? <IconCrown color="gold"/> : (joinedEventsNames.includes(event.name))? <IconUsers color="white" fill="rgb(72, 225, 115)"/> : ((event.headcount===event.capacity)? <IconUsers color="lightcoral"/> : <IconUsers color="white"/>)}     
                <p>{event.headcount}/{event.capacity}</p>  
              </div>
            </div>
            <div className={styles.eventDetails}>
              <p>{event.location_name}</p>
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
        <OutdoorSpotDetails outdoorspot={props.currspot} handlebackclick={props.handlebackclick} ></OutdoorSpotDetails>
      </div>
    )  
  }

  if (props.show === "EventDetails") {
    return (
      <div className={styles.box}>
        <EventDetails outdoorevent={props.currevent} outdoorspot={props.outdoorspots.find(spot => spot.name === props.currevent.location_name) as OutdoorSpot} handleclick={props.handleclick} handlebackclick={props.handlebackclick} handlecancelclick={props.handlecancelclick} handlejoinclick={props.handlejoinclick} handlequitclick={props.handlequitclick}></EventDetails>
      </div>
    )
  }

  if (props.show == "HostEvent") {
    return (
      <div className={styles.box}>
        <HostEvent outdoorspots={props.outdoorspots} handlebackclick={props.handlebackclick} handlelisteventclick={props.handlelisteventclick}></HostEvent>
      </div>
    )
  }
}


interface OutdoorSpotDetailsProps {
  outdoorspot: OutdoorSpot;
  handlebackclick: ()=>void;    
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
          </div>
        </div>
      </div>
      
      <div className={styles.controls}>
        <button className={styles.redButton} onClick={props.handlebackclick}>Back</button>
      </div>
    </div>
  )
}


interface EventDetailsProps {
  outdoorevent: OutdoorEvent;
  outdoorspot: OutdoorSpot;
  handleclick: (spot: OutdoorSpot)=> void;
  handlebackclick: ()=>void;
  handlecancelclick: (name: string)=>void;
  handlejoinclick: (host_username: string, name: string) => void;
  handlequitclick: (host_username: string, name: string) => void;
}

function EventDetails(props: EventDetailsProps) {
  const { user, error, isLoading } = useUser();

  return (
    <div className={styles.detailsBox}>
      <div className={styles.detailsBoxMain}>
        <div className={styles.boxEventHeader}>
          <h3>{props.outdoorevent.name}</h3>
          <div className={styles.headcount}>
            {(hostedEventsNames.includes(props.outdoorevent.name))? <IconCrown color="gold" size={32}/> :(props.outdoorevent.headcount===props.outdoorevent.capacity)? <IconUsers color="lightcoral" size={32}/> : <IconUsers color="white" size={32}/>}    
            <p>{props.outdoorevent.headcount}/{props.outdoorevent.capacity}</p>  
          </div>
        </div>
        <div className={styles.eventDetails}>
          <button className={styles.eventDetailsSpot} onClick={() => props.handleclick(props.outdoorspot)}>{props.outdoorspot.name}</button>
          <p>{props.outdoorevent.description}</p>
        </div>
      </div>
      
      <div className={styles.controls}>
        {hostedEventsNames.includes(props.outdoorevent.name) ? <button className={styles.redButton} onClick={() => props.handlecancelclick(props.outdoorevent.name)}>Cancel event</button> : joinedEventsNames.includes(props.outdoorevent.name) ? <button className={styles.redButton} onClick={() => props.handlequitclick(props.outdoorevent.host_username, props.outdoorevent.name)}>Quit</button> : props.outdoorevent.headcount === props.outdoorevent.capacity ? <button className={styles.greenButtonDisabled} title="Event Full!" disabled>Join</button> : user? <button className={styles.greenButton} onClick={() => props.handlejoinclick(props.outdoorevent.host_username, props.outdoorevent.name)}>Join</button> : <button className={styles.greenButtonDisabled} title="You have to be logged in first" disabled>Join</button>}
        <button className={styles.redButton} onClick={props.handlebackclick}>Back</button>
      </div>
    </div>
  )
}

