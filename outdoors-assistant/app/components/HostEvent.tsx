import { useState, useEffect } from "react";
import { OutdoorSpot } from "../page";
import styles from "../page.module.css";


interface HostEventProps {
  outdoorspots: OutdoorSpot[];
  handlebackclick: () => void;
  handlelisteventclick: (name: string, location_name: string, datetime: string, description: string, capacity: number) => void;
}

export default function HostEvent(props: HostEventProps) {
  const textAreaRows = 10;
  const currentDate = new Date(); 
  currentDate.setMinutes(currentDate.getMinutes() - currentDate.getTimezoneOffset());
  const currentDateString = currentDate.toISOString().slice(0, 16);
  const [name, setName] = useState("");
  const [eventListingSpot, setEventListingSpot] = useState("none")
  const [dateTime, setDatetTime] = useState(currentDateString);
  const [capacity, setCapacity] = useState(0);
  const [description, setDescription] = useState("");
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedName = (e.target as HTMLInputElement).value;
    setName(selectedName); 
  }
  const handleSpotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSpotName = (e.target as HTMLSelectElement).value;
    const selectedSpot = props.outdoorspots.find(spot => spot.name === selectedSpotName) as OutdoorSpot;
    setEventListingSpot(selectedSpot.name); 
  }
  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDateTime = e.target.value;
    setDatetTime(selectedDateTime); 
  }
  const handleCapacityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCapacity = (e.target as HTMLSelectElement).value;
    setCapacity(Number(selectedCapacity)); 
  }
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const selectedDescription = (e.target as HTMLTextAreaElement).value;
    setDescription(selectedDescription); 
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
            <input type="text" id="name" name="name" className={styles.smallTextInput} onChange={handleNameChange}/>
          </label>
          <label>
            Outdoor spot:
            <select className={styles.selectInput} value={eventListingSpot} onChange={handleSpotChange}>
              {props.outdoorspots.map((spot) => (
                <option value={spot.name} key={spot.name}>{spot.name}</option>
              ))}
            </select>
          </label>   
          <label>
            Capacity:
            <select className={styles.selectInput} value={capacity} onChange={handleCapacityChange}>
              {Array.from(Array(50).keys()).map((number) => (
                <option value={number} key={number}>{number}</option>
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
            <textarea id="descriptionText" className={styles.descriptionTextBox} font-size="32px" rows={textAreaRows} onChange={handleDescriptionChange}></textarea>
          </div>
        </form>
      </div>
      <div className={styles.controls}>
        <button className={styles.greenButton} onClick={() => props.handlelisteventclick(name, eventListingSpot, dateTime, description, capacity)}>Create Event</button> 
        <button className={styles.redButton} onClick={props.handlebackclick}>Back</button>
      </div>
    </div>
  )
}