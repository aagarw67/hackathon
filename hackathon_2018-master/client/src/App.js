import React, { Component } from 'react';
import './App.css';
import InfoCard from './InfoCard';

class App extends Component {

  state = { messages: [] }

  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
    this.onPin = this.onPin.bind(this);
    this.onDisliked = this.onDisliked.bind(this);
  }

  componentDidMount() {
    this.connection = new WebSocket('ws://localhost:40510');
    this.connection.onmessage = evt => {
      const data = JSON.parse(evt.data);
      const element = { ...data, guid: Date.now() };

      let messages = this.state.messages.slice();
      messages.unshift(element);


      if (messages.length > 5) {
        const notPinned = [];
        messages.forEach((e,i) => {
          if(!e.pinned) notPinned.push(i);
        });
        while(messages.length > 5 && notPinned.length > 0) {
          const remove = notPinned.pop();
          messages.splice(remove, 1);
        }
      }
      this.setState({
        messages: messages
      })
    };
  }

  onClose(guid) {
    let messages = this.state.messages.filter(mess => {
      return mess.guid !== guid
    });
    this.setState({
      messages: messages
    })
  }

  onPin(guid) {
    let updated = this.state.messages.slice();
    let message = updated.find(m => m.guid === guid);
    message.pinned = message.pinned ? !message.pinned : true;
    this.setState({
      messages: updated
    });
  }

  onDisliked(guid) {
    let updated = this.state.messages.slice();
    let message = updated.find(m => m.guid === guid);
    message.disliked = message.disliked ? !message.disliked : true;
    this.setState({
      messages: updated
    });
  }

  render() {
    const cards = this.state.messages.map(mess =>
      <InfoCard key={mess.guid} message={mess} onClose={this.onClose} onPin={this.onPin} onDisliked={this.onDisliked} />
    );

    return (
      <div className="container App">
        {cards}
      </div>
    );
  }
}

export default App;
