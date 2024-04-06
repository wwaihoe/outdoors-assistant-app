'use server'
const moment = require("moment-timezone");

export const hostEvent = async (host_username: string, name: string, location_name: string, datetime: string, description: string, capacity: number, headcount: number) => {
  const adjustedDatetime = moment.tz(datetime, "Asia/Singapore").utc().format();
  try {
    const response = await fetch(`http://events-database:3002/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({host_username: host_username, name: name, location_name: location_name, datetime: adjustedDatetime, description: description, capacity: capacity, headcount: headcount})
    });

    if (!response.ok) {
      alert("Failed to create event");
    }

    const newEvent = await response.json();
  } catch (error) {
    console.error(error);
    alert("Failed to create event");
  }
}
