'use server'

export const cancelEvent = async (host_username: string, name: string) => {
  const response = await fetch(`http://events-database:3002/events/${host_username}/${name}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
