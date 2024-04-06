'use server'

export const quitEvent = async (host_username: string, name: string, participant: string) => {
  try {
    const response = await fetch(`http://events-database:3002/events/quit/${host_username}/${name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({participant: participant})
    });
    if (!response.ok) {
      alert("Failed to quit event");
    }
  } catch (error) {
    console.error(error);
    alert("Failed to quit event");
  }
}
