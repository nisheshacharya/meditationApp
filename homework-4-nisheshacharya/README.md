# MIU-CS571-2023-10-Homework4
## Updates to Meditation App
### Add Logo
Add your logo image to be displayed in the top middle section of your home screen. (Try to bare in mind platform compatibility)
  
### Add Inputs
Previously, we created a Meditation application that has 10 mins meditation + 2 mins of rest by default. Update your application to accept the following inputs:
* Number of seconds for meditation
* Number of seconds for rest
  
All inputs should be displayed in a single row, above your **Start Meditation** button.
  
### Meditation History List
Use Context to save all of the user's completed workout records like below. Each record contains the starting time of meditation.
```javascript
history = [ {year: '2020' , month: '04', day: '28', hour: '22', minute:'30'} ]
```
Use `FlatList` component to display all of the Meditation History List When users click a button: **Meditation History** from your home screen.

Use AsyncStorage to save all meditations in the phone for next loading app.

### Application Sketch
```
      <LOGO>
      0000

Meditation   Rest
[10]         [2]

 <START> || <STOP> || <PAUSE/RESUME>
 
<Meditation History>
```
