"use client"

import styles from "../page.module.css";
import { useState } from "react";
import { OutdoorSpot } from "../page";
import { useUser } from '@auth0/nextjs-auth0/client';

interface AddReviewProps {
  outdoorspot: OutdoorSpot;
  handlebackclick: ()=>void;
  handlesubmitreviewclick: (rating: number, description: string)=>void;
}

export default function AddReview(props: AddReviewProps) {
  const [rating, setRating] = useState(0);
  const textAreaRows = 10;
  const { user, error, isLoading } = useUser();

  return (
    <div className={styles.detailsBox}>
      <div className={styles.detailsBoxMain}>
        <h2 className={styles.boxHeader}>{props.outdoorspot.name}</h2>
        <div className={styles.details}>
          <div className={styles.submitReview}>
            <div className={styles.starRating}>
              {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                  <button 
                    type="button"
                    key={index}
                    className={index <= rating ? styles.starButtonOn : styles.starButtonOff}
                    onClick={() => setRating(index)}
                  >
                    <span className="star">&#9733;</span>
                  </button>
                );
              })}
            </div>
            <div className={styles.reviewForm}>
              <h3>Enter your review here:</h3>
              <textarea id="reviewText" className={styles.reviewTextBox} style={{ fontSize: "32px" }} rows={textAreaRows} maxLength={1000}></textarea>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.controls}>
        <button className={styles.greenButton} onClick={() => props.handlesubmitreviewclick(rating, (document.getElementById('reviewText') as HTMLTextAreaElement).value)}>Submit Review</button>
        <button className={styles.redButton} onClick={props.handlebackclick}>Back</button>
      </div>
    </div>
  )
}