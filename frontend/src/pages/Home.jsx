import React, { useContext } from 'react';
import { UserContext } from '../context/userContext';

const Home = () => {
  const { utorid, role } = useContext(UserContext);
  const today = new Date();
  const hour = today.getHours();
  const greeting = hour >= 0 && hour < 12 ? "morning" : (hour < 18 ? "afternoon" : "evening");
  return (
    <>
      <div>
        {/* left panel */}
        <div>
            <div>
              <h1>Good {greeting},</h1>
              <h2>{utorid}</h2>
              <p>Today is {today.toLocaleDateString('en-US', { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.</p>
            </div>

            <div>
              <p>QUICK ACTIONS</p>
              <div>
                box
              </div>
            </div>
        </div>
        
        {/* right panel */}
        <div>
          <h3></h3>
        </div> 
      </div>
    </>
  );
};

export default Home;