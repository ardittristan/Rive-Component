import React from "react";
import PropTypes from "prop-types";
import watchSize from "watch-size";
import loadRive from "../../rive-loader"

const scrollEvent = new Event('scroll')

class App extends React.Component {
  constructor(props) {
    super(props);
    this.animationContainer = React.createRef();
    this.resize = this.resize.bind(this);
    this.windowResizeHandler = this.windowResizeHandler.bind(this);
    this.stop = () => {};
    this.width = 0;
    this.height = 0;

    console.log()

    /**
     * @param {HTMLCanvasElement} canvas
     */
    this.setCanvas = async (canvas) => {

      this.animationCanvas = canvas;
      if (!canvas) {
        return;
      }

      const { rive, file } = await loadRive(this.props.assetUrl);
      const { CanvasRenderer, LinearAnimationInstance, Alignment, Fit } = rive;

      const artboard = this.props.artboard != null
        ? file.artboard(this.props.artboard)
        : file.defaultArtboard();

      // Find an animation.
      const animation = this.props.animation
        ? artboard.animation(this.props.animation)
        : artboard.animation('Untitled 1');

      // Make an animation instance (stores time and direction state
      // for a single animation).
      const animationInstance = new LinearAnimationInstance(animation);

      const ctx = canvas.getContext('2d', { alpha: false });
      const renderer = new CanvasRenderer(ctx);
      artboard.advance(0);
      artboard.draw(renderer);

      let lastTime = 0;

      function drawFrame(time) {
        // Check if canvas is on screen
        const rect = canvas.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          requestAnimationFrame(drawFrame);
          return;
        }

        if (!lastTime) {
          lastTime = time;
        }
        const elapsedSeconds = (time - lastTime) / 1000;
        lastTime = time;

        animationInstance.advance(elapsedSeconds);
        animationInstance.apply(artboard, 1.0);

        artboard.advance(elapsedSeconds);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        renderer.align(
          Fit.cover,
          Alignment.center,
          {
            minX: 0,
            minY: 0,
            maxX: canvas.width,
            maxY: canvas.height,
          },
          artboard.bounds
        );
        artboard.draw(renderer);
        ctx.restore();
        requestAnimationFrame(drawFrame);
      }
      requestAnimationFrame(drawFrame);
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.windowResizeHandler);
    this.stop = watchSize(this.animationContainer.current.parentNode.host.parentElement, ({width, height}) => {
      this.width = width;
      this.height = height;
      this.resize();
    })
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowResizeHandler);
    this.stop();
  }

  windowResizeHandler() {
    /** @type {HTMLCollection} */
    let childElements = this.animationContainer.current.parentNode.host.parentElement.children
    for (let i = 0; i < childElements.length; i++) {
      childElements[i].dispatchEvent(scrollEvent)
    }
  }

  resize() {
    this.animationCanvas.width = this.width;
    this.animationCanvas.height = this.height;
  }

  render() {
    return (
        <div ref={this.animationContainer} className="riveAnimation">
          <canvas ref={this.setCanvas} />
        </div>
    );
  }
}

App.defaultProps = {
  assetUrl: "",
  animation: "",
};

App.propTypes = {
  assetUrl: PropTypes.string.isRequired,
  animation: PropTypes.string,
  artboard: PropTypes.string,
};

export default App;
