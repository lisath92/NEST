import React, { Component } from 'react';
import './App.css';

import logo from './assets/chatroom/logo.svg';
import desktopLogo from './assets/chatroom/desktop-logo.svg';
import send from './assets/chatroom/send.svg';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      languagePreference: "en",
      serverUuid: "",
      name: "User1",
      previousSender: ""
    };
    this.socket = null;
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.isMessageFromSelf = this.isMessageFromSelf.bind(this);
    this.isMessageFromPrevUser = this.isMessageFromPrevUser.bind(this);
    this.hideUserNameFromMessage = this.hideUserNameFromMessage.bind(this);
    this.displayMessage = this.displayMessage.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleKeyPress(event) {
    if (event.charCode === 13) {
      const message = event.target.value || " ";
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
      if(data.user === this.state.previousSender) {
        this.setState({ 
            messages: this.state.messages.concat([{
            user: data.user,
            message: data.message,
            isPartOfGroup: true
          }])
        });
      } else {
        this.setState({ 
            messages: this.state.messages.concat([{
            user: data.user,
            message: data.message,
            isPartOfGroup: false
          }]),
            previousSender: data.user
        });
      }
    }
 }

  hideUserNameFromMessage(data) {
    return <div className="msg">{data.message}</div>
  }

  displayMessage(data) {
      return(
        <div>
          <div className="user">{data.user}</div>
          <div className="msg">{data.message}</div>
        </div>
      );
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
    return data.user === this.state.name;
  }

  isMessageFromPrevUser(data) {
    return data.user === this.state.previousSender;
  }

  handleNameChange(event) {
    this.socket.send(JSON.stringify({
      id: this.state.serverUuid,
      name: event.target.value
    }));
    this.setState({
      name: event.target.value
    });
  }

  render() {
    return (
      <div className="chatroom">
        <div className="desktop-wrapper">
          <div className="desktop-sidebar">
            <img src={desktopLogo} alt="logo"/>
            <h1>N.E.S.T.</h1>
          </div>
          <div className="chat-container">
            <header className="chatroom-header">
              <div className="logo">
                <img src={logo} alt="logo"/>
              </div>
              <h3>March Week 3</h3>
              <div className="lang-dropdown">
                <select type="dropdown" value={this.state.languagePreference} onChange={this.handleDropdownChange}>
                  <option name="English" value="en">English</option>
                  <option name="Chinese" value="zh-TW">中文</option>
                  <option name="French" value="fr">Français</option>
                  <option name="Korean" value="ko">한국어</option>
                  <option name="Spanish" value="es">Español</option>
                </select>
              </div>
            </header>
            <div className="msg-container"> 
              {this.state.messages.map((data, index) => {
                return(
                  <div key={data.userUuid} className= { "msg-wrapper " + (this.isMessageFromSelf(data) ? "self " : "other ") + (data.isPartOfGroup ? "group" : "" )}>
                    {data.isPartOfGroup || this.isMessageFromSelf(data) ? this.hideUserNameFromMessage(data) : this.displayMessage(data)}
                  </div>  
                )
              })}
            </div>
            <div className="messageInputBar">
              <input onKeyPress={this.handleKeyPress} placeholder="Message..."/>
              <button onClick={this.handleKeyPress}>Send <span><img src={send} alt="send message"/></span>
              </button>
            </div>
          </div>
        </div>
        <select type="dropdown" value={this.state.name} onChange={this.handleNameChange}>
            <option value="User1">User1</option>
            <option value="User2">User2</option>
          </select>
      </div>
    );
  }
}

export default App;