import React, { useState, useEffect } from 'react';

const LoginForm = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMetadata, setUserMetadata] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const loginStatus = await magicAuth.user.isLoggedIn();
      setIsLoggedIn(loginStatus);
      if (loginStatus) {
        const metadata = await magicAuth.user.getMetadata();
        setUserMetadata(metadata);
      }
    };
    fetchData();
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();
    // handle login logic here
  };

  const handleLogout = () => {
    // handle logout logic here
  };

  
    /* 
  <div>
          <h1>Please sign up or login</h1>
          <form>
            <input
              type="email"
              name="email"
              required="required"
              placeholder="Enter your email"
            />
            <button onClick={handleLogin} type="submit">Send</button>
          </form>
        </div>
         */
   

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h1>Current user: {userMetadata.email}</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h1>Please sign up or login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              required="required"
              placeholder="Enter your email"
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginForm;