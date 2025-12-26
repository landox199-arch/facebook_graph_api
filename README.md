# Facebook Graph API Explorer

## Project Description

This project is a web application that demonstrates the integration of Facebook Graph API. It allows users to authenticate using an access token and retrieve their complete profile information.

## API Details

### Base URL

https://graph.facebook.com/v24.0

### Endpoints Used

#### GET /me
Retrieves the authenticated user's profile information. This endpoint fetches comprehensive user data including basic information (id, name, email), personal details (birthday, age_range, gender, relationship_status), location data (location, hometown), social information (link, about, website, verified), media (picture, cover), and professional information (work, education). The fields parameter is used to specify which data fields to retrieve from the API.

### Required Parameters

### Authentication Method: OAuth 2.0

### Sample JSON Response

#### User Profile Response

{
  "id": "123456789",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "birthday": "01/15/1990",
  "age_range": {
    "min": 21
  },
  "gender": "male",
  "location": {
    "name": "New York, New York"
  },
  "hometown": {
    "name": "Los Angeles, California"
  },
  "link": "https://www.facebook.com/john.doe",
  "about": "Software developer and tech enthusiast",
  "website": "https://johndoe.com",
  "verified": false,
  "picture": {
    "data": {
      "url": "https://graph.facebook.com/v24.0/123456789/picture"
    }
  },
  "cover": {
    "source": "https://graph.facebook.com/v24.0/123456789/picture?type=large"
  },
  "work": [
    {
      "employer": {
        "name": "Tech Company"
      },
      "position": {
        "name": "Software Engineer"
      }
    }
  ],
  "education": [
    {
      "school": {
        "name": "University Name"
      },
      "type": "College"
    }
  ],
  "relationship_status": "Single"
}


## API Key and Token Security

The access token is entered by the user in the input field and is not stored in localStorage. Users must provide their own access token each time they use the application. The token is only used for API requests and is not persisted. Sensitive values are not hardcoded in the repository. Users should keep their access tokens secure and not share them publicly.

## Instructions to Run the Project

1. Download or clone the project repository
2. Open the index.html file in a web browser
3. Obtain a Facebook Access Token from Facebook Graph API Explorer
4. Enter the access token in the authentication section input field
5. Click the "Get My Profile" button or press Enter in the input field
6. View the profile information displayed in the results section below
7. Use the theme toggle switch in the header to switch between dark and light mode

## Screenshots

<img width="1427" height="958" alt="image" src="https://github.com/user-attachments/assets/09486b71-bbe4-4633-82a0-63df5920a610" />
<img width="740" height="939" alt="image" src="https://github.com/user-attachments/assets/8c03f823-6ca0-4e8c-a2fb-a9507ceb78cb" />


## Members Listed and Roles

Mian Jo Martin: API and Authentication Handler
Russel Jan Doquenia: JavaScript Logic and Data Processing
Maria Veronica Geron: UI and CSS Designer
Mary Diane Iglesia: GitHub and Documentation Manager


