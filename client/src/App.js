import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      languagePreference: "en",
      serverUuid: ""
    };
    this.socket = null;
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }

  handleKeyPress(event) {
    if (event.charCode === 13) {
      const message = event.target.value;
      this.socket.send(JSON.stringify({
        message,
        clientInfo: {
          languagePreference: this.state.languagePreference,
        }
      }));
      event.target.value = "";
    }
  }

  handleSocketEvents(event) {
    try {
      const data = JSON.parse(event.data);
      this.setState({serverUuid: data.uuid});
    } catch (e) {
      this.setState({
        messages: this.state.messages.concat([event.data])
      });
    }
  }

  componentDidMount() {
    // Change this to ngrok-provided url during demo
    this.socket = new WebSocket("ws://localhost:8081"); 
    this.socket.addEventListener("message", (event) => {
      this.handleSocketEvents(event);
    });
  }

  handleDropdownChange(event) {
    this.setState({
      languagePreference: event.target.value
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
        <div className="langDropdown">
          <select type="dropdown" value={this.state.languagePreference} onChange={this.handleDropdownChange}>
            <option name="English" value="en">English</option>
            <option name="Chinese" value="zh-TW">Chinese</option>
            <option name="French" value="fr">French</option>
            <option name="Korean" value="ko">Korean</option>
            <option name="Spanish" value="es">Spanish</option>
          </select>
        </div>
      </div>
    );
  }
}

export default App;