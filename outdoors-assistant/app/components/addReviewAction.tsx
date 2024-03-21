'use server'

export const submitReview = async (username: string, spotname: string, rating: number, description: string) => {
  const initials = spotname.replace(/[^A-Z]+/g, "");
  const response = await fetch(`http://localhost:3003/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username: username, location_name: initials, rating: rating, description: description})
  });
  const newReview = await response.json();
}
