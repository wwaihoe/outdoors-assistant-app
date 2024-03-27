'use server'

export const hostEvent = async (host_username: string, name: string, location_name: string, datetime: string, description: string, capacity: number, headcount: number) => {
  const response = await fetch(`http://events-database:3002/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({host_username: host_username, name: name, location_name: location_name, datetime: datetime, description: description, capacity: capacity, headcount: headcount})
  });
  const newEvent = await response.json();
}
