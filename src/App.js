import {AppConsumer, Container, Stage} from '@inlet/react-pixi';
import React, {Component} from 'react';

import RotatingBunny from './components/rotating-bunny';

class App extends Component {
  state = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
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
          <AppConsumer>
            {app => <RotatingBunny app={app}/>}
          </AppConsumer>
        </Container>
      </Stage>
    );
  }
}

export default App;
