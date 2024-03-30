"use client"

import styles from "../page.module.css";
import { useState, useEffect } from "react";
import { OutdoorSpot } from "../page";
import { useUser } from '@auth0/nextjs-auth0/client';
import { IconStarFilled } from '@tabler/icons-react';


interface SeeReviewsProps {
  outdoorspot: OutdoorSpot;      
  handlereviewclick: (spot:OutdoorSpot)=>void; 
  handlebackclick: ()=>void;    
}

interface Review {
  review_id: number;
  username: string;
  location_name: string;
  rating: number;
  description: string;
}

export default function SeeReviews(props: SeeReviewsProps) {
  const { user, error, isLoading } = useUser();
  const initials = props.outdoorspot.name.replace(/[^A-Z]+/g, "");
  const [spotReviews, setSpotReviews] = useState<Review[]>([]);
  useEffect(() => {
    fetch(`http://localhost:3003/reviews/${initials}`)
      .then((res) => res.json())
      .then((data) => {
        setSpotReviews(data as Review[]); 
      })
  }, [initials])
  
  return (
    <div className={styles.detailsBox}>
      <div className={styles.detailsBoxMain}>
        <h2 className={styles.boxHeader}>{props.outdoorspot.name}</h2>
        <div className={styles.details}>
          <div className={styles.rating}>
            <p className={styles.ratingText}>{props.outdoorspot.rating?.toFixed(2)}</p>
            {props.outdoorspot.rating !== null ? <IconStarFilled /> : <p>No reviews</p>}
          </div>
          <div className={styles.list}>
            {spotReviews.map((review) => (
              <div className={styles.reviewEntry} key={review.review_id}>
                <h3>{review.username}</h3>
                <div className={styles.rating}>
                  <p className={styles.smallRatingText}>{review.rating}</p>
                  <IconStarFilled size={20}/>
                </div>
                <p>{review.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className={styles.controls}>
        <button className={styles.redButton} onClick={props.handlebackclick}>Back</button>
        {user? <button className={styles.greenButton} onClick={() => props.handlereviewclick(props.outdoorspot)}>Review</button>: <button className={styles.greenButtonDisabled} title="You have to be logged in first" disabled>Review</button>}
      </div>
    </div>
  )
}