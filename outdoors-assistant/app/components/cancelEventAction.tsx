'use server'

export const cancelEvent = async (host_username: string, name: string) => {
  try {
    const response = await fetch(`http://events-database:3002/events/${host_username}/${name}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      alert("Failed to cancel event");
    }
  } catch (error) {
    console.error(error);
    alert("Failed to cancel event");
  }
}
