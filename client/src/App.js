import React, { Component } from 'react';
import Logo from './components/Logo/logo'; 
import Navigation from './components/Navigation/Navigation.js';
import Rank from './components/Rank/rank.js';
import ImageLinkForm from './components/ImageLinkForm/imagelinkform.js';
import FaceRecognition from './components/FaceRecognition/facerecognition.js';
import SignIn from './components/SignIn/signin.js';
import Register from './components/Register/register.js';
import 'tachyons';

import Clarifai from'clarifai';
import Signin from './components/SignIn/signin';

const app = new Clarifai.App({
  apiKey: 'af50c3a379b64f009fbc3d441a1a3abd'
 });
class App extends Component {
  constructor(){
    super();
    this.state={
      input: '',
      imageUrl:'',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }

  }
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }
  calculateFaceLocation = (data)=>{
  const clarifaiFace=data.outputs[0].data.regions[0].region_info.bounding_box;
  const image= document.getElementById('fieldimage');
  const width =  Number(image.width);
  const height = Number(image.height);
  //console.log(width, height);
  return{
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }

  }

  displayFaceBox = (box)=>{
    //console.log(box);
    this.setState({box:box});
  }
  onInputChange = (event)=>{
    this.setState({input: event.target.value})
  }
  onSubmit=()=>{
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  
  }
  onRouteChange=(route)=>{
    if(route === 'signout'){
      this.setState({isSignedIn:false})
    }else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    
    this.setState({route:route});
  }
  render() {
    const {isSignedIn, imageUrl, route, box} = this.state;
    return (

      <div className="App">
      <Navigation isSignedIn = {isSignedIn} onRouteChange={this.onRouteChange}/>
       
       { route === 'home'
       ?<div>
           <Logo/>
           <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
     <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
    <FaceRecognition box={box} imageUrl={imageUrl}/>
    </div> 
    : 
    (
      route === 'signin'
      ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
    )
        }
        </div>
      
    );
  }
}

export default App;
