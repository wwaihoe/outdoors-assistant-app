'use server'

export const submitReview = async (username: string, spotname: string, rating: number, description: string) => {
  try {
    const initials = spotname.replace(/[^A-Z]+/g, "");
    const response = await fetch(`http://reviews-database:3003/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: username, location_name: initials, rating: rating, description: description})
    });
    if (!response.ok) {
      alert("Failed to submit review");
    }
    const newReview = await response.json();
  } catch (error) {
    alert("Failed to submit review");
    console.error(error);
  }
}
