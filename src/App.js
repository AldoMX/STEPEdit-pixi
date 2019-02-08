import React, {Component} from 'react';
import {Stage, Text} from '@inlet/react-pixi';
import NxParser from './parser/nx';

import {loadAssets} from './components/note';
import {loadAssets as loadSpecialAssets} from './components/note-special';
import StepComponent from './components/step';

const rootElement = document.getElementById('root');

class App extends Component {
  state = {
    step: null,
    width: rootElement.clientWidth,
    height: rootElement.clientHeight,
    y: 32,
    isLoaded: false
  };

  componentDidMount() {
    window.addEventListener('dragover', this.preventDefault, true);
    window.addEventListener('drop', this.onDrop, true);
    window.addEventListener('resize', this.onResize, true);
    window.addEventListener('wheel', this.onWheel, true);
    loadAssets(() => {
      loadSpecialAssets(() => {
        this.setState({isLoaded: true});
      });
    });
  }

  componentWillUnmount() {
    window.removeEventListener('dragover', this.preventDefault);
    window.removeEventListener('drop', this.onDrop);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('wheel', this.onWheel);
  }

  onDrop =
      (event) => {
        const file = event.dataTransfer.files[0];
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const {step} = new NxParser(file.name, fileReader.result);
          this.setState({step, y: 32});
        }
        fileReader.readAsArrayBuffer(file);
        event.preventDefault();
      }

  onResize =
      (event) => {
        if (this.onResizeTimeout != null) {
          clearTimeout(this.onResizeTimeout);
        }
        this.onResizeTimeout = setTimeout(() => {
          this.updateBounds();
          this.onResizeTimeout = null;
        }, 250);
      }

  onWheel =
      (event) => {
        const y = Math.min(this.state.y - event.deltaY, 32);
        this.setState({y});
      }

  preventDefault =
      (event) => {
        event.preventDefault();
      }

  updateBounds =
      () => {
        const width = rootElement.clientWidth;
        const height = rootElement.clientHeight;
        this.setState({width, height});
      }

  render() {
    const {width, height} = this.state;
    return (
      <Stage width={width} height={height} options={{ backgroundColor: 0xffffff }}>
        {this.renderNotes()}
      </Stage>
    );
  }

  renderNotes() {
    const y = this.state.y;
    const centerX = this.state.width / 2;
    if (!this.state.isLoaded || this.state.step == null) {
      return (<Text text="Drag a .NX file to continue..." anchor={[0.5, 0]} x={centerX} y={y} />);
    }
    return (<StepComponent step={this.state.step} x={centerX} y={y} />);
  }
}

export default App;
