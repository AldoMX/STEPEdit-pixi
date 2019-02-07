import React, {Component} from 'react';
import {AppConsumer, Container, Stage} from '@inlet/react-pixi';

import Hold from './components/hold';
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
        <AppConsumer>
          {app => this.renderNotes(app)}
        </AppConsumer>
      </Stage>
    );
  }

  renderNotes(app) {
    if (!this.state.isLoaded) {
      return null;
    }
    const centerX = this.state.width / 2;
    const holdHeight = 120;
    return (
      <Container>
        <Hold ticker={app.ticker} skin='SKIN00' type='HOLD' col='CENTER' height={holdHeight} x={centerX} y={32} />
        <Hold ticker={app.ticker} skin='SKIN00' type='HOLD' col='UPLEFT' height={holdHeight} x={centerX - 50} y={32} />
        <Hold ticker={app.ticker} skin='SKIN00' type='HOLD' col='UPRIGHT' height={holdHeight} x={centerX + 50} y={32} />
        <Hold ticker={app.ticker} skin='SKIN00' type='HOLD' col='DOWNLEFT' height={holdHeight} x={centerX - 100} y={32} />
        <Hold ticker={app.ticker} skin='SKIN00' type='HOLD' col='DOWNRIGHT' height={holdHeight} x={centerX + 100} y={32} />
        <Note ticker={app.ticker} skin='SKIN00' type='TAP' col='CENTER' x={centerX} y={holdHeight + 60} />
        <Note ticker={app.ticker} skin='SKIN00' type='TAP' col='UPLEFT' x={centerX - 50} y={holdHeight + 60} />
        <Note ticker={app.ticker} skin='SKIN00' type='TAP' col='UPRIGHT' x={centerX + 50} y={holdHeight + 60} />
        <Note ticker={app.ticker} skin='SKIN00' type='TAP' col='DOWNLEFT' x={centerX - 100} y={holdHeight + 60} />
        <Note ticker={app.ticker} skin='SKIN00' type='TAP' col='DOWNRIGHT' x={centerX + 100} y={holdHeight + 60} />
      </Container>
    );
  }
}

export default App;
