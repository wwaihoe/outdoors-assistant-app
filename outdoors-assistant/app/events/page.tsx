"use client"

import Image from "next/image";
import styles from "../page.module.css";
import NavBar from "../components/NavBar";
import GoogleMaps from "../components/GoogleMaps";
import { useState } from "react";
import { OutdoorSpot } from "../page";
import { IconUsers, IconPlus, IconCrown, IconStarFilled } from '@tabler/icons-react';
import { useAuth } from "../components/AuthProvider";


const outdoorPlaces = [
  {name: "Bishan-Ang Mo Kio Park", lat: 1.3636059844137054, lng: 103.84347570917122, rating: 4.5}, 
  {name: "Singapore Botanic Gardens", lat: 1.315291338311505, lng: 103.8162004140456, rating: 5.0},
  {name: "Labrador Nature Reserve", lat: 1.266593151401208, lng: 103.80209914969167, rating: 3.8}
]


const listedEvents = [
  {name: "Central meet", capacity: 5, headcount: 3, description: "Meetup in Bishan park.", outdoorSpotName: "Bishan-Ang Mo Kio Park"},
  {name: "Bishan Party", capacity: 10, headcount: 5, description: "Hangout with friends in Bishan park.", outdoorSpotName: "Bishan-Ang Mo Kio Park"}, 
  {name: "Botanic Picnic", capacity: 20, headcount: 20, description: "Local cuisine picnic at Botanic Gardens.", outdoorSpotName: "Singapore Botanic Gardens"},
  {name: "chill session", capacity: 8, headcount: 8, description: "", outdoorSpotName: "Labrador Nature Reserve"}
]

const joinedEventsNames = ["Bishan Party"]

const hostedEventsNames = ["Botanic Picnic"]


export default function Events() {
  const [coordinates, setCoordinates] = useState({lat: 1.34357, lng: 103.84422});
  const [zoom, setZoom] = useState(12);
  const eventSpotsNames = listedEvents.map(event => event.outdoorSpotName);
  const eventSpots = outdoorPlaces.filter((spot) => eventSpotsNames.includes(spot.name)) as OutdoorSpot[];
  const [markers, setMarkers] = useState(eventSpots);
  const [currSpot, setCurrSpot] = useState<OutdoorSpot>(eventSpots[0]);
  const [show, setShow] = useState<"Events" | "Details" | "EventDetails" | "HostEvent">("Events");
  const [currEvent, setCurrEvent] = useState(listedEvents[0])

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
  

  return (
    <main className={styles.main}>
      <NavBar/>
      <div className={styles.center}> 
        <GoogleMaps lat={coordinates.lat} lng={coordinates.lng} zoom={zoom} markers={markers} handleclick={handleClick} />
        <EventsList outdoorspots={outdoorPlaces} outdoorevents={listedEvents} show={show} currspot={currSpot} currevent={currEvent} handleclick={handleClick} handleeventclick={handleEventClick} handlebackclick={handleBackClick} handlehosteventclick={handleHostEventClick} />
      </div>
    </main>
  );
}

interface OutdoorEvent {
  name: string;
  capacity: number;
  headcount: number;
  description: string;
  outdoorSpotName: string;
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
}

function EventsList(props: EventsListProps) {
  const auth = useAuth();

  if (props.show === "Events") {
    return (
      <div className={styles.box}>
        <div className={styles.boxHeader}>
          <h2>Outdoor Events</h2>
          {auth?.token? <button className={styles.addEventButton} onClick={props.handlehosteventclick}>Host Event<IconPlus color="white" size={32}/></button>: <button className={styles.addEventButtonDisabled} onClick={props.handlehosteventclick} title="You have to be logged in first" disabled>Host Event<IconPlus color="white" size={32}/></button>}
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
              <p>{event.outdoorSpotName}</p>
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
        <EventDetails outdoorevent={props.currevent} outdoorspot={props.outdoorspots.find(spot => spot.name === props.currevent.outdoorSpotName) as OutdoorSpot} handleclick={props.handleclick} handlebackclick={props.handlebackclick} ></EventDetails>
      </div>
    )
  }

  if (props.show == "HostEvent") {
    return (
      <div className={styles.box}>
        <HostEvent outdoorspots={props.outdoorspots} handlebackclick={props.handlebackclick} ></HostEvent>
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
            <p className={styles.ratingText}>{props.outdoorspot.rating}</p>
            <IconStarFilled/>
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
}

function EventDetails(props: EventDetailsProps) {
  const auth = useAuth();
  const handleJoinClick = () => {

  }
  const handleQuitClick = () => {

  }
  const handleCancelClick = () => {

  }
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
        {hostedEventsNames.includes(props.outdoorevent.name) ? <button className={styles.redButton} onClick={handleCancelClick}>Cancel event</button> : joinedEventsNames.includes(props.outdoorevent.name) ? <button className={styles.redButton} onClick={handleQuitClick}>Quit</button> : props.outdoorevent.headcount === props.outdoorevent.capacity ? <button className={styles.greenButtonDisabled} title="Event Full!" disabled>Join</button> : auth?.token ? <button className={styles.greenButton} onClick={handleJoinClick}>Join</button> : <button className={styles.greenButtonDisabled} title="You have to be logged in first" disabled>Join</button>}
        <button className={styles.redButton} onClick={props.handlebackclick}>Back</button>
      </div>
    </div>
  )
}


interface HostEventProps {
  outdoorspots: OutdoorSpot[];
  handlebackclick: () => void;
}

function HostEvent(props: HostEventProps) {
  const textAreaRows = 10;
  const currentDate = new Date(); 
  currentDate.setMinutes(currentDate.getMinutes() - currentDate.getTimezoneOffset());
  const currentDateString = currentDate.toISOString().slice(0, 16);
  const [eventListingSpot, setEventListingSpot] = useState<OutdoorSpot | null>(null)
  const [dateTime, setDatetTime] = useState(currentDateString);

  const handleSpotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSpotName = (e.target as HTMLSelectElement).value;
    const selectedSpot = props.outdoorspots.find(spot => spot.name === selectedSpotName) as OutdoorSpot;
    setEventListingSpot(selectedSpot); 
  }
  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDateTime = e.target.value;
    setDatetTime(selectedDateTime); 
  }
  const handleCreateListingClick = () => {

  }


  return (
    <div className={styles.detailsBox}>
      <div className={styles.boxHeader}>
        <h2>Event Listing</h2>
      </div>
      <div className={styles.detailsBoxMain}>
        <form className={styles.createListingDetails}>
          <label>
            Name:
            <input type="text" name="name" className={styles.smallTextInput}/>
          </label>
          <label>
            Outdoor spot:
            <select className={styles.selectInput} value={eventListingSpot?.name || "none"} onChange={handleSpotChange}>
              {props.outdoorspots.map((spot) => (
                <option value={spot.name}>{spot.name}</option>
              ))}
            </select>
          </label>   
          <label htmlFor="event-datetime">Date and time:
            <input
              type="datetime-local"
              id="event-datetime"
              name="event-datetime"
              className={styles.dateTimePicker}
              value={dateTime}
              min={currentDateString}
              onChange={handleDateTimeChange}
              />
          </label>
          <div className={styles.descriptionForm}>
            <p>Description:</p>
            <textarea id="descriptionText" className={styles.descriptionTextBox} font-size="32px" rows={textAreaRows}></textarea>
          </div>
        </form>
      </div>
      <div className={styles.controls}>
        <button className={styles.greenButton} onClick={handleCreateListingClick}>Create Event</button> 
        <button className={styles.redButton} onClick={props.handlebackclick}>Back</button>
      </div>
    </div>
  )
}