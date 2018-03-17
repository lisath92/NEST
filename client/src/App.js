import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
    this.socket = null;
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(event) {
    if (event.charCode === 13) {
      const message = event.target.value;
      this.socket.send(message);
      event.target.value = "";
    }
  }

  componentDidMount() {
    // Change this to ngrok-provided url during demo
   this.socket = new WebSocket("wss://5f43935f.ngrok.io"); 
   this.socket.addEventListener("message", (event) => {
    this.setState({
      messages: this.state.messages.concat([event.data])
    });
   });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="chatContainer"> 
          {this.state.messages.map((message, index) => {
            return <div key={index}>{message}</div>
          })}
        </div>
        <div className="messageInputBar">
          <input onKeyPress={this.handleKeyPress} /> 
        </div> 
      </div>
    );
  }
}

export default App;
