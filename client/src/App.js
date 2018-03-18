import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      languagePreference: "en",
      serverUuid: "",
      name: "",
      previousSender: ""
    };
    this.socket = null;
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.isMessageFromSelf = this.isMessageFromSelf.bind(this);
    this.hideUserNameFromMessage = this.hideUserNameFromMessage.bind(this);
    this.displayMessage = this.displayMessage.bind(this);
  }

  handleKeyPress(event) {
    if (event.charCode === 13) {
      const message = event.target.value;
      const data = {
        message,
        name: this.state.name
      };
      this.socket.send(JSON.stringify(data));
      event.target.value = "";
    }
  }

  handleSocketEvents(event) {
    const data = JSON.parse(event.data);
    // Handles initial connection that saves uuid
    if (data.id && data.id !== null) {
      this.setState({serverUuid: data.id});
    } else {
      this.setState({ 
        messages: this.state.messages.concat([{
          user: data.username,
          message: data.message,
          userUuid: data.userUuid
        }])
      });
    }
  }

  hideUserNameFromMessage(data) {
    return <div key={data.useruserUuid}>{data.message}</div>
  }

  displayMessage(data) {
    if (data.user === this.state.previousSender) {
      this.hideUserNameFromMessage(data);
    } else {
      this.setState({previousSender: data.user})
      return(
        <div key={data.userUuid}>
          <div>{data.user}</div>
          <div>{data.message}</div>
        </div>
      );
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
    this.socket.send(JSON.stringify({
      id: this.state.serverUuid,
      languagePreference: event.target.value
    }));
  }

  isMessageFromSelf(data) {
    return data.userUuid === this.state.serverUuid;
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
          {this.state.messages.map((data, index) => {
            {this.isMessageFromSelf(data) ? this.hideUserNameFromMessage(data) : this.displayMessage(data)}
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
          <p>This is ID: {this.state.serverUuid}</p>
        </div>
      </div>
    );
  }
}

export default App;