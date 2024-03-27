'use server'

export const joinEvent = async (host_username: string, name: string, newParticipant: string) => {
  const response = await fetch(`http://events-database:3002/events/join/${host_username}/${name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({newParticipant: newParticipant})
  });
}
