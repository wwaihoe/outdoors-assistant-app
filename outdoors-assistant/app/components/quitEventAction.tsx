'use server'

export const quitEvent = async (host_username: string, name: string, participant: string) => {
  const response = await fetch(`http://events-database:3002/events/quit/${host_username}/${name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({participant: participant})
  });
}
