# Quotes and Stories Task (Completed)

The project is built in **Node.js** using **Express** in the backend.
**No database** is used as it was not needed for the task.

### **Task: Google Calendar Integration** 

**Description**
- User should be able to authenticate with the system with the users gmail account
- Build a web service to read my upcoming events and give the events in a json.
- Build a web service to send an event.  
  * ✔ It should accept attende email id’s as input
  * ✔ Body of the meeting
  * ✔ Title of the meeting
Use SDK’s if possible.
- No need to build fancy UI. 
- Use basic html tags to demonstrate the demo.

**Acceptance Criteria**

As a user, i should come to your website and authenticate with my Google Gmail account and you should be able to read my calendar and show the events 


**Qualifying criteria** 
- ✔ Write the documentation about your service (ReadMe is enough)
- ✔ Share the Github project public url
- ✔ Should use Node.js as backend development
- ✔ Deploy the code in a public cloud and give the URL to test out the application.
- ❓ Code quality, readability and maintainability are key factors.

**How to use the app?**

1. Go to https://test.tauseefahmad.com
2. Press the login button, you'll be redirected to google for authentication.![Login Screen](https://user-images.githubusercontent.com/36216432/80108319-c92ecf00-8599-11ea-9b66-fcc0fc032ba1.png)
3. After authentication you'll be redirected to the dashboard where you'll get a list of all the upcoming events.![Dashboard](https://user-images.githubusercontent.com/36216432/80109986-d056dc80-859b-11ea-9a7a-99c9621a7a2f.jpg)
4. You can create a Google Calender event by clicking the create event button.![Create event screen](https://user-images.githubusercontent.com/36216432/80110149-fed4b780-859b-11ea-83f5-e329759cdcfb.png)

**Technical details**

The app uses Google **Userinfo** and **Calendar** api scope to fetch get user information and events.
The **API** returns a **Bearer** token which is attached to headers along with subsequent requests.

The application keeps user logged in for a certain ammount of time using **cookies**.

If an API was to be built, the access token return from the Google API could be sent to the client as a **JWT**, and then with subsequent requests, the client could send request to the server along with the token which could be verified on the server side and then used by server to fetch data from Google Calender API.

**User input is hashed**
