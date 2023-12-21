import { getURLWithQueryParams } from "../../helpers/auth";

const Oauth = async (req, res) => {
  try {
    
    // Query to exchange our authorization code for an access token 
    const LINKEDIN_URL = getURLWithQueryParams(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        grant_type: "authorization_code",
        code: req.query.code,
        redirect_uri: process.env.LINKEDIN_REDIRECT,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET
      }
    );

    let resp = await fetch(LINKEDIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    if (!resp.ok) {
      console.error('LinkedIn API error:', resp.statusText);
      res.status(500).send('Error exchanging authorization code for access token');
      return;
    }

    const tok = await resp.json();

    if (!tok || !tok.access_token) {
      console.error('Token is not defined or invalid');
      res.status(500).send('Error retrieving access token from LinkedIn');
      return;
    }

    const { access_token, expires_in } = tok;

    // Query to exchange our token for user info
    const auth = "Bearer " + access_token;
    let u = {};
    const usr = await fetch("https://api.linkedin.com/v2/userinfo", {
      method: "GET",
      headers: { Connection: "Keep-Alive", Authorization: auth }
    });

    if (!usr.ok) {
      console.error('LinkedIn API error:', usr.statusText);
      res.status(500).send('Error retrieving user information from LinkedIn');
      return;
    }

    u = await usr.json();

    if (u.given_name) {
      // Assuming additionalParams is an object containing additional parameters
      const additionalParams = {
        name : u.name,
        firstName: u.given_name,
        lastName: u.family_name,
        email: u.email,
        picture: u.picture
        // Add more parameters as needed
      };
    
      const queryString = new URLSearchParams(additionalParams).toString();
    
      res.redirect(`/hello/${u.given_name}?${queryString}`);
    } else {
      console.error('User info not available');
      res.status(500).send('Error: User information not available');
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    res.status(500).send('Internal server error');
  }
};

export default Oauth;
