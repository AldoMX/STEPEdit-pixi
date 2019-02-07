import React, {Component} from 'react';
import {AppConsumer, Container, Stage} from '@inlet/react-pixi';

import Note from './components/note';

class App extends Component {
  state = {
    width: window.innerWidth,
    height: window.innerHeight,
    isLoaded: false
  };

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    Note.loadAssets(() => {
      this.setState(() => ({isLoaded: true}));
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize =
      (event) => {
        if (this.onResizeTimeout != null) {
          clearTimeout(this.onResizeTimeout);
        }
        this.onResizeTimeout = setTimeout(() => {
          this.updateBounds(event.target.innerWidth, event.target.innerHeight);
          this.onResizeTimeout = null;
        }, 250);
      }

  updateBounds =
      (width, height) => {
        this.setState(() => ({width, height}));
      }

  render() {
    const {width, height} = this.state;
    return (
      <Stage width={width} height={height}>
        <Container x={width / 2} y={height / 2}>
          {this.renderAppConsumer()}
        </Container>
      </Stage>
    );
  }

  renderAppConsumer() {
    if (!this.state.isLoaded) {
      return null;
    }
    return (
      <AppConsumer>
        {app => <Note ticker={app.ticker} skin='SKIN00' type='TAP' col='DOWNLEFT' />}
      </AppConsumer>
    );
  }
}

export default App;
