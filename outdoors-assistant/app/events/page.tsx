"use client"

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
import { outdoorPlaces } from "../../public/data/OutdoorPlaces";


export default function Events() {
  const { user, error, isLoading } = useUser();
  const [coordinates, setCoordinates] = useState({lat: 1.34357, lng: 103.84422});
  const [zoom, setZoom] = useState(12);
  const [show, setShow] = useState<"Events" | "Details" | "EventDetails" | "HostEvent">("Events");
  const [listedEvents, setListedEvents] = useState<OutdoorEvent[]>([])
  const [currEvent, setCurrEvent] = useState(listedEvents[0])
  const [spots, setSpots] = useState<OutdoorSpot[]>(outdoorPlaces);
  const [markers, setMarkers] = useState<OutdoorSpot[]>([]);
  const [currSpot, setCurrSpot] = useState<OutdoorSpot>(spots[0]);
  const hostedEventsNames = listedEvents.filter(event => event.host_username === user?.email).map(event => event.name);
  const joinedEventsNames = listedEvents.filter(event => event.participants.includes(user?.email as string)).map(event => event.name);  
  const [dengueWarning, setDengueWarning] = useState<number>(0);

  useEffect(() => {
    console.log("Fetching ratings");
    for (let i = 0; i < spots.length; i++){
      let initials = spots[i].name.replace(/[^A-Z]+/g, "");
      fetch(`http://localhost:3003/reviews/${initials}/average`)
        .then((res) => {
          if (!res.ok) {
            alert("Failed to fetch ratings");
          }
          return res.json();
          })
        .then((data) => {
          spots[i].rating = data.average_rating;
        })
        .catch((error) => {
          console.error(error);
          alert("Failed to fetch ratings");
        });
    }
  }, [show, spots])

  useEffect(() => {
    fetch(`http://localhost:3002/events`)
      .then((res) => {
      if (!res.ok) {
        alert("Failed to fetch events");
      }
      return res.json();
      })
      .then((data) => {
      setListedEvents(data);
      })
      .catch((error) => {
      console.error(error);
      alert("Failed to fetch events");
      });
  }, [show])

  useEffect(() => {
    const eventSpotsNames = listedEvents.map(event => event.location_name);
    const eventSpots = spots.filter((spot) => eventSpotsNames.includes(spot.name)) as OutdoorSpot[];
    setMarkers(eventSpots);
  }, [listedEvents])

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
    console.log(location_name);
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
        <GoogleMaps lat={coordinates.lat} lng={coordinates.lng} zoom={zoom} handleclick={handleClick} markers={markers} setdenguewarning={setDengueWarning}/>
        <EventsList outdoorspots={spots} outdoorevents={listedEvents} show={show} currspot={currSpot} denguewarning={dengueWarning} currevent={currEvent} hostedeventsnames={hostedEventsNames} joinedeventsnames={joinedEventsNames} handleclick={handleClick} handleeventclick={handleEventClick} handlebackclick={handleBackClick} handlehosteventclick={handleHostEventClick} handlelisteventclick={handleListEventClick} handlecancelclick={handleCancelClick} handlejoinclick={handleJoinClick} handlequitclick={handleQuitClick}/>
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
  denguewarning: number;
  hostedeventsnames: string[];
  joinedeventsnames: string[];
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
  const parse_timestamp = (timestamp_str: string) => {
    // Create a Date object from the ISO 8601 timestamp
    const dateObj = new Date(timestamp_str);
  
    // Extract date components
    const year = dateObj.getFullYear();
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Pad month with zero
    const day = ('0' + dateObj.getDate()).slice(-2); // Pad day with zero
  
    // Extract time components
    const hours = ('0' + dateObj.getHours()).slice(-2); // Pad hours with zero
    const minutes = ('0' + dateObj.getMinutes()).slice(-2); 
  
    // Format the output
    const date = `${year}/${month}/${day}`;
    const time = `${hours}:${minutes}`;
  
    return { date, time };
  }

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
                {(props.hostedeventsnames.includes(event.name))? <IconCrown color="gold"/> : (props.joinedeventsnames.includes(event.name))? <IconUsers color="white" fill="rgb(72, 225, 115)"/> : ((event.headcount===event.capacity)? <IconUsers color="lightcoral"/> : <IconUsers color="white"/>)}     
                <p>{event.headcount}/{event.capacity}</p>  
              </div>
            </div>
            <div className={styles.eventDetails}>
              <p>{event.location_name}</p>
              <p>{parse_timestamp(event.datetime).date} {parse_timestamp(event.datetime).time}</p>
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
        <OutdoorSpotDetails outdoorspot={props.currspot} denguewarning={props.denguewarning} handlebackclick={props.handlebackclick} ></OutdoorSpotDetails>
      </div>
    )  
  }

  if (props.show === "EventDetails") {
    return (
      <div className={styles.box}>
        <EventDetails outdoorevent={props.currevent} outdoorspot={props.outdoorspots.find(spot => spot.name === props.currevent.location_name) as OutdoorSpot} hostedeventsnames={props.hostedeventsnames} joinedeventsnames={props.joinedeventsnames} handleclick={props.handleclick} handlebackclick={props.handlebackclick} handlecancelclick={props.handlecancelclick} handlejoinclick={props.handlejoinclick} handlequitclick={props.handlequitclick}></EventDetails>
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
  denguewarning: number;
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


interface EventDetailsProps {
  outdoorevent: OutdoorEvent;
  outdoorspot: OutdoorSpot;
  hostedeventsnames: string[];
  joinedeventsnames: string[];
  handleclick: (spot: OutdoorSpot)=> void;
  handlebackclick: ()=>void;
  handlecancelclick: (name: string)=>void;
  handlejoinclick: (host_username: string, name: string) => void;
  handlequitclick: (host_username: string, name: string) => void;
}

function EventDetails(props: EventDetailsProps) {
  const { user, error, isLoading } = useUser();
  const parse_timestamp = (timestamp_str: string) => {
    // Create a Date object from the ISO 8601 timestamp
    const dateObj = new Date(timestamp_str);
  
    // Extract date components
    const year = dateObj.getFullYear();
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Pad month with zero
    const day = ('0' + dateObj.getDate()).slice(-2); // Pad day with zero
  
    // Extract time components
    const hours = ('0' + dateObj.getHours()).slice(-2); // Pad hours with zero
    const minutes = ('0' + dateObj.getMinutes()).slice(-2); 
  
    // Format the output
    const date = `${year}/${month}/${day}`;
    const time = `${hours}:${minutes}`;
  
    return { date, time };
  }

  return (
    <div className={styles.detailsBox}>
      <div className={styles.detailsBoxMain}>
        <div className={styles.boxEventHeader}>
          <h3>{props.outdoorevent.name}</h3>
          <div className={styles.headcount}>
            {(props.hostedeventsnames.includes(props.outdoorevent.name))? <IconCrown color="gold" size={32}/> : (props.joinedeventsnames.includes(props.outdoorevent.name))? <IconUsers color="white" fill="rgb(72, 225, 115)" size={32}/> : ((props.outdoorevent.headcount === props.outdoorevent.capacity)? <IconUsers color="lightcoral" size={32}/> : <IconUsers color="white" size={32}/>)}     
            <p>{props.outdoorevent.headcount}/{props.outdoorevent.capacity}</p>  
          </div>
        </div>
        <div className={styles.eventDetails}>
          <button className={styles.eventDetailsSpot} onClick={() => props.handleclick(props.outdoorspot)}>{props.outdoorspot.name}</button>
          <p style={{ marginBottom: "1rem" }}>{parse_timestamp(props.outdoorevent.datetime).date} {parse_timestamp(props.outdoorevent.datetime).time}</p>
          <p>{props.outdoorevent.description}</p>
        </div>
      </div>
      
      <div className={styles.controls}>
        {props.hostedeventsnames.includes(props.outdoorevent.name) ? <button className={styles.redButton} onClick={() => props.handlecancelclick(props.outdoorevent.name)}>Cancel event</button> : props.joinedeventsnames.includes(props.outdoorevent.name) ? <button className={styles.redButton} onClick={() => props.handlequitclick(props.outdoorevent.host_username, props.outdoorevent.name)}>Quit</button> : props.outdoorevent.headcount === props.outdoorevent.capacity ? <button className={styles.greenButtonDisabled} title="Event Full!" disabled>Join</button> : user? <button className={styles.greenButton} onClick={() => props.handlejoinclick(props.outdoorevent.host_username, props.outdoorevent.name)}>Join</button> : <button className={styles.greenButtonDisabled} title="You have to be logged in first" disabled>Join</button>}
        <button className={styles.redButton} onClick={props.handlebackclick}>Back</button>
      </div>
    </div>
  )
}

