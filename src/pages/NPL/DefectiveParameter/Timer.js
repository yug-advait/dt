import React, { useState, useEffect } from "react";
import AddModal from "./AddModal";

const Timer = ({timeLeft,setTimeLeft}) => {
  

  // Modal state
  const [open, setOpen] = useState(false);


  useEffect(() => {
    // If the timeLeft reaches 0, stop the timer
    if (timeLeft === 0) return;

    // Update the timer every second
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Set open to true every minute (60 seconds)
//   useEffect(() => {
//     const minuteInterval = setInterval(() => {
//       setOpen(true); // Open the modal every minute
//     }, 60000); // 60,000 ms = 1 minute

//     // Clear the interval on component unmount
//     return () => clearInterval(minuteInterval);
//   }, []);

useEffect(()=>{
   if(timeLeft === 240  || timeLeft === 240 || timeLeft === 180 || timeLeft === 120 || timeLeft === 60){
    setOpen(true);
   }
},[timeLeft])

  // Format time in MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div style={styles.timerContainer}>
      <div style={styles.timer}>
        {/* Font Awesome clock icon */}
        <i className="fas fa-clock" style={styles.icon}></i>
        <span style={styles.timeText}>{formatTime(timeLeft)}</span>
      </div>

      <AddModal isOpen={open} toggle={() => setOpen(!open)} />
    </div>
  );
};

const styles = {
  timerContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 9999,
  },
  timer: {
    backgroundColor: "#007bff", // Blue background for contrast
    color: "white",
    padding: "12px 20px", // Increased padding for a more prominent look
    borderRadius: "10px", // Rounded corners for modern style
    display: "flex",
    alignItems: "center",
    fontSize: "1.5rem", // Larger font size for better visibility
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Soft shadow for a 3D effect
    transition: "background-color 0.3s ease", // Smooth background color change on hover
  },
  icon: {
    marginRight: "12px", // Spacing between icon and text
  },
  timeText: {
    fontWeight: "bold", // Bold text for time to make it stand out
  },
};

export default Timer;
