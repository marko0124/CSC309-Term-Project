import React from 'react';
import { useAuth } from '../context/authContext';
import HomeNavbar from './navbar/HomeNavbar';
import './Home.css'
import { Link } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const today = new Date();
  const hour = today.getHours();
  const greeting = hour >= 0 && hour < 12 ? "morning" : (hour < 18 ? "afternoon" : "evening");
  {/* <div>
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
  </div> */}
  return (

    <div>
      <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
      <HomeNavbar />

      {/* Header Section */}
      <div className='header-container'>
        <div className='header-text'>
          <h1></h1>
          <div className='header-text-details'>
            <div>
              <h1>Good {greeting}, {user.name}</h1>
              <p>Today is {today.toLocaleDateString('en-US', { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="custom-shape-divider-top-1743545933">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>

      {/* Main Content */}
      <div>
      <div className='profile-container'>
      <div className='profile-info-grid'>
        
        <div className="info-card">
          <div className="info-section">
            <h3>My Points</h3>
            <div className="info-row justify-content-center">
              <span className="big">{user.points}</span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <div className="info-section">
            <h3>Quick Actions</h3>
            <Link to={'/transactions/transfer'} className='mb-3'>
              <button className='edit-button'>Transfer your points</button>
            </Link>
            <Link to={'/transactions/redeem'} className='mb-3'>
              <button className='edit-button'>Redeem points</button>
            </Link>
            <Link to={'/transactions/all'} className='mb-3'>
              <button className='edit-button'>View my transactions</button>
            </Link>
            <Link to={'/profile'} className='mb-3'>
              <button className='edit-button'>Edit your profile</button>
            </Link>

            {/* cashier */}
            { (user.role === "cashier" || user.role === "manager" || user.role === "superuser") &&
              <h3>Cashier Actions</h3>
            }
            { (user.role === "cashier" || user.role === "manager" || user.role === "superuser") &&
              <Link to={'/transactions/cashier/create'} className='mb-3'>
              <button className='edit-button'>Create a purchase transaction</button>
              </Link>
            }
            { (user.role === "cashier" || user.role === "manager" || user.role === "superuser") &&
              <Link to={'/transactions/cashier/processRedemption'} className='mb-3'>
              <button className='edit-button'>Process a redemption request</button>
              </Link>
            }
            
            {/* manager */}
            { (user.role === "manager" || user.role === "superuser") &&
              <h3>Manager Actions</h3>
            }
            { (user.role === "manager" || user.role === "superuser") &&
              <Link to={'/transactions/manage/all'} className='mb-3'>
              <button className='edit-button'>View all transactions</button>
              </Link>
            }
            { (user.role === "manager" || user.role === "superuser") &&
              <Link to={'/users'} className='mb-3'>
              <button className='edit-button'>View all users</button>
              </Link>
            }
            { (user.role === "manager" || user.role === "superuser") &&
              <Link to={'/create-user'} className='mb-3'>
              <button className='edit-button'>Create a new user</button>
              </Link>
            }

          </div>
        </div>
        
       </div>
      </div>


      </div>

      <div className='footer'>Footer</div>
    </div>

  );
};

export default Home;