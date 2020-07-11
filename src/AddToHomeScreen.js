import React, { Component } from 'react';

class AddToHomeScreen extends Component {
  constructor(props) {
    super(props);
    this.deferredPrompt = null;
    this.state = {
      isIos: false,
      show: false
    };
  }

  isIos() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  }

  isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

  componentDidMount() {
    // Checks if should display install popup notification:
    if (this.isIos() && !this.isInStandaloneMode()) {
      alert('TRUE');
      this.setState({ isIos: true });
    }

    if (!this.state.isIos) {
      window.addEventListener('beforeinstallprompt', e => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        // @ts-ignore
        this.deferredPrompt = e;
        // Show button
        console.log('beforeinstallprompt triggered... show add button');
        this.setState({ show: true });
      });
    }
  }

  // bind to this
  handleAddClick() {
    if (this.deferredPrompt) {
      this.setState({ show: false });
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }

        this.deferredPrompt = null;
      });
    } else {
      console.log('Invalid prompt object');
    }
  }

  render() {
    const { show } = this.state;
    if (!show) return null;
    console.log('AICI AJUnge');

    return (
      <div>
        {
          this.state.isIos ? (
            <p>{'Add to home screen using [] -> Add to homescreen'}</p>
          ) : (
            <button onClick={this.handleAddClick.bind(this)}> Add to home screen</button>
          )
        }
      </div>
    );
  }
}

export default AddToHomeScreen;
