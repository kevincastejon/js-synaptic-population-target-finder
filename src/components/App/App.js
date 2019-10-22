import React from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';
import ReactNotification from 'react-notifications-component';
import PropTypes from 'prop-types';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Lang from '../../lang/Lang';
import './App.css';

export default class App extends React.Component {
  static parseIntInput(value) {
    let val = parseInt(value, 10);
    if (Number.isNaN(val)) {
      val = 0;
    }
    return val;
  }

  static parseFloatInput(value) {
    let val = parseFloat(value);
    if (Number.isNaN(val)) {
      val = 0;
    }
    return val;
  }

  constructor(props) {
    super(props);
    this.addNotification = this.addNotification.bind(this);
    this.notificationDOMRef = React.createRef();
    const language = navigator.language || navigator.userLanguage;
    this.state = {
      simulationNum: 50,
      savedPop: '',
      initialized: false,
      autoEvolve: true,
      exportedPop: '',
      training: false,
      playing: false,
      progress: 0,
      population: 10,
      leaders: 4,
      hiddenLayers: [6],
      mutateRate: 0.2,
      chrono: 8,
      speed: 1,
      french: language === 'fr' ? 1 : 0,
      copyEnabled: true,
    };
    this.sendStartGame = this.sendStartGame.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keyup', (e) => {
      const {
        speed,
      } = this.state;
      const {
        changeSpeed,
      } = this.props;
      let val = -1;
      if (e.key === '+') {
        val = speed + 1;
      } else if (e.key === '-') {
        val = speed - 1;
      }
      if (val > -1) {
        if (val > 8) {
          val = 8;
        }
        if (val < 0) {
          val = 0;
        }
        changeSpeed(val);
        this.setState({
          speed: val,
        });
      }
    });
  }

  addNotification(notifType, lang) {
    this.notificationDOMRef.current.addNotification({
      title: notifType === 'copy' ? Lang.copiedTitle[lang] : Lang.simTitle[lang],
      message: notifType === 'copy' ? Lang.copiedMessage[lang] : Lang.simMessage[lang],
      type: 'success',
      insert: 'top',
      container: 'top-right',
      animationIn: ['animated', 'fadeIn'],
      animationOut: ['animated', 'fadeOut'],
      dismiss: { duration: 500 },
      dismissable: { click: true },
    });
  }

  sendStartGame() {
    const { startGame } = this.props;
    startGame((currentPop) => {
      const { autoEvolve } = this.state;
      if (!autoEvolve) {
        this.setState({
          playing: false,
          exportedPop: JSON.stringify(currentPop),
        });
      } else {
        this.setState({
          exportedPop: JSON.stringify(currentPop),
        });
        this.sendStartGame();
      }
    });
  }

  render() {
    const {
      simulationNum,
      savedPop,
      initialized,
      autoEvolve,
      exportedPop,
      training,
      playing,
      progress,
      population,
      leaders,
      hiddenLayers,
      mutateRate,
      chrono,
      speed,
      french,
      copyEnabled,
    } = this.state;
    const {
      init,
      startTrain,
      changeSpeed,
      changeLang,
    } = this.props;
    return (
      <div id="app">
        <ReactNotification ref={this.notificationDOMRef} />
        <Navbar bg="light" expand="lg">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Navbar.Brand>
              <Button
                id="langBtn"
                variant={french ? 'warning' : 'light'}
                onClick={() => {
                  this.setState({
                    french: 1,
                  }, () => changeLang(1));
                }
            }
              >
                <Image src="./frFlag.png" fluid />
              </Button>
            </Navbar.Brand>
            <Navbar.Brand>
              <Button
                id="langBtn"
                variant={!french ? 'warning' : 'light'}
                onClick={() => {
                  this.setState({
                    french: 0,
                  }, () => changeLang(0));
                }
          }
              >
                <Image src="./brFlag.png" fluid />
              </Button>
            </Navbar.Brand>
            <Nav.Link href="https://github.com/lePioo/yellow-vest-deep-learning-ia">{Lang.more[french]}</Nav.Link>
          </Navbar.Collapse>
        </Navbar>
        <div id="header">
          <h1>{Lang.header[french]}</h1>
        </div>
        { initialized ? null
          : (
            <div id="initPanel">
              <Form>
                <Container>
                  <Row id="initRow">
                    <Col>
                      <Form.Group>
                        <InputGroup className="inputs">
                          <InputGroup.Prepend>
                            <OverlayTrigger
                              overlay={(
                                <Popover title={Lang.demographyTitle[french]}>
                                  {Lang.demography[french]}
                                </Popover>
)}
                            >
                              <InputGroup.Text className="inputsHeaders" id="basic-addon2">
                                {Lang.protesters[french]}
                              </InputGroup.Text>
                            </OverlayTrigger>
                          </InputGroup.Prepend>
                          <FormControl
                            type="number"
                            onChange={(e) => {
                              let val = App.parseIntInput(e.target.value);
                              if (val < 2) {
                                val = 2;
                              }
                              this.setState({
                                population: val,
                                leaders: leaders <= val ? leaders : val,
                              });
                            }}
                            value={population}
                            aria-label="number of brains"
                          />
                        </InputGroup>
                      </Form.Group>
                      <Form.Group>
                        <InputGroup className="inputs">
                          <InputGroup.Prepend>
                            <OverlayTrigger
                              overlay={(
                                <Popover title={Lang.elitismTitle[french]}>
                                  {Lang.elitism[french]}
                                </Popover>
)}
                            >
                              <InputGroup.Text className="inputsHeaders" id="basic-addon2">Leaders</InputGroup.Text>
                            </OverlayTrigger>
                          </InputGroup.Prepend>
                          <FormControl
                            type="number"
                            min="2"
                            max={population}
                            onChange={(e) => {
                              let val = App.parseIntInput(e.target.value);
                              if (val < 2) {
                                val = 2;
                              } else if (val > population) {
                                val = population;
                              }
                              this.setState({
                                leaders: val,
                              });
                            }}
                            value={leaders}
                            aria-label="number of leaders"
                          />
                        </InputGroup>
                      </Form.Group>
                      <Form.Group>
                        <InputGroup className="inputs">
                          <InputGroup.Prepend>
                            <OverlayTrigger
                              overlay={(
                                <Popover title="Mutation">
                                  {Lang.mutationTT[french]}
                                </Popover>
)}
                            >
                              <InputGroup.Text className="inputsHeaders" id="basic-addon2">{Lang.mutation[french]}</InputGroup.Text>
                            </OverlayTrigger>
                          </InputGroup.Prepend>
                          <FormControl
                            type="number"
                            min="0.1"
                            max="1"
                            step="0.1"
                            onChange={(e) => {
                              let val = App.parseFloatInput(e.target.value);
                              if (val > 1) {
                                val = 1;
                              }
                              if (val < 0.1) {
                                val = 0.1;
                              }
                              this.setState({
                                mutateRate: val,
                              });
                            }}
                            value={mutateRate}
                            aria-label="mutation rate"
                          />
                        </InputGroup>
                      </Form.Group>
                      <Form.Group>
                        <InputGroup className="inputs">
                          <InputGroup.Prepend>
                            <OverlayTrigger
                              overlay={(
                                <Popover title={Lang.durationTitle[french]}>
                                  {Lang.durationTT[french]}
                                </Popover>
)}
                            >
                              <InputGroup.Text className="inputsHeaders" id="basic-addon2">{Lang.duration[french]}</InputGroup.Text>
                            </OverlayTrigger>
                          </InputGroup.Prepend>
                          <FormControl
                            type="number"
                            min="1"
                            step="1"
                            onChange={(e) => {
                              let val = App.parseIntInput(e.target.value);
                              if (val < 1) {
                                val = 1;
                              }
                              this.setState({
                                chrono: val,
                              });
                            }}
                            value={chrono}
                            aria-label="act duration"
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <InputGroup className="inputs">
                          <InputGroup.Prepend>
                            <OverlayTrigger
                              overlay={(
                                <Popover title={Lang.trainTitle[french]}>
                                  {Lang.train[french]}
                                </Popover>
)}
                            >
                              <InputGroup.Text className="firstTrainedPop" id="basic-addon2">
                                {Lang.trainedPop[french]}
                                <br />
                                {Lang.optional[french]}
                                <br />
                                {Lang.paste[french]}
                              </InputGroup.Text>
                            </OverlayTrigger>
                          </InputGroup.Prepend>
                          <FormControl
                            onChange={(e) => {
                              this.setState({
                                savedPop: e.target.value,
                              });
                            }}
                            value={savedPop}
                            as="textarea"
                            className="textArea"
                            aria-label="Saved population"
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                </Container>
                <Form.Group>
                  <Button
                    type="submit"
                    id="initBtn"
                    variant="warning"
                    onClick={(e) => {
                      e.preventDefault();
                      try {
                        const opts = {
                          yellowVestNumber: population,
                          leaders,
                          hiddenLayers,
                          trainedPopul: savedPop.length > 0 ? JSON.parse(savedPop) : '',
                          mutateRate,
                          chrono,
                        };
                        this.setState({
                          initialized: true,
                          exportedPop: savedPop,
                        }, () => init(opts));
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                  >
                    {Lang.startRevo[french]}
                  </Button>
                </Form.Group>
              </Form>
            </div>
          )
      }
        { !initialized ? null
          : (
            <div id="gamePanel">
              <Container>
                <Row id="initRow">
                  <Col>
                    <Form>
                      <Form.Group>
                        <InputGroup className="gameInputs">
                          <InputGroup.Prepend>
                            <Button
                              type="submit"
                              variant="warning"
                              className="gameBtns"
                              disabled={training || playing}
                              onClick={(e) => {
                                e.preventDefault();
                                this.setState({ training: true, playing: false });
                                startTrain(simulationNum, (currentProgress) => {
                                  this.setState({ progress: currentProgress + 1 });
                                }, (pop) => {
                                  this.setState({
                                    training: false,
                                    progress: 0,
                                    exportedPop: JSON.stringify(pop),
                                  });
                                  this.addNotification('simulation', french);
                                });
                              }}
                            >
                              {training ? `${Lang.simulating[french]} ${progress}/` : Lang.simulate[french]}
                            </Button>
                          </InputGroup.Prepend>
                          <FormControl
                            disabled={training || playing}
                            type="number"
                            max={9999}
                            min={1}
                            onChange={(e) => {
                              this.setState({
                                simulationNum: App.parseIntInput(e.target.value),
                              });
                            }}
                            value={simulationNum}
                            aria-label="count of simulated generations"
                          />
                          <InputGroup.Append>
                            <InputGroup.Text id="basic-addon2">{Lang.acts[french]}</InputGroup.Text>
                          </InputGroup.Append>
                        </InputGroup>
                      </Form.Group>
                    </Form>
                    {Lang.or[french]}
                    <Form>
                      <InputGroup className="gameInputs">
                        <Button
                          type="submit"
                          className="gameBtns"
                          disabled={training || playing}
                          onClick={(e) => {
                            e.preventDefault();
                            this.setState({ training: false, playing: true });
                            this.sendStartGame();
                          }}
                          variant="warning"
                        >
                          {Lang.getMacron[french]}
                        </Button>
                        <InputGroup.Prepend>
                          <InputGroup.Text id="basic-addon2">{Lang.chain[french]}</InputGroup.Text>
                        </InputGroup.Prepend>
                        <InputGroup.Append>
                          <InputGroup.Checkbox
                            checked={autoEvolve}
                            onChange={() => {
                              this.setState({
                                autoEvolve: !autoEvolve,
                              });
                            }}
                          />
                        </InputGroup.Append>
                      </InputGroup>
                    </Form>
                  </Col>
                  <Col>
                    <InputGroup className="trainedPop">
                      <InputGroup.Prepend>
                        {exportedPop.length > 0
                          ? (
                            <OverlayTrigger
                              overlay={(
                                <Popover title={Lang.trainTitle[french]}>
                                  {Lang.trainSave[french]}
                                </Popover>
)}
                            >
                              <InputGroup.Text>
                                {Lang.trainedPop[french]}
                                <br />
                                {Lang.copy[french]}
                              </InputGroup.Text>
                            </OverlayTrigger>
                          )
                          : (
                            <InputGroup.Text>
                              {Lang.trainedPop[french]}
                              <br />
                              {Lang.copy[french]}
                            </InputGroup.Text>
                          )}
                      </InputGroup.Prepend>
                      <FormControl
                        onClick={(e) => {
                          if (!copyEnabled || e.target.value.length === 0) {
                            return;
                          }
                          e.target.setSelectionRange(0, e.target.value.length);
                          document.execCommand('copy');
                          this.addNotification('copy', french);
                          this.setState({
                            copyEnabled: false,
                          });
                          setTimeout(() => {
                            this.setState({
                              copyEnabled: true,
                            });
                          }, 2000);
                        }}
                        readOnly
                        value={exportedPop}
                        as="textarea"
                        className="textArea"
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </Container>
              <div id="speedControl">
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon2">{Lang.speed[french]}</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    type="number"
                    step={1}
                    min={0}
                    max={8}
                    onChange={(e) => {
                      let val = parseFloat(e.target.value, 10);
                      if (Number.isNaN(val)) {
                        val = 0;
                      }
                      if (val > 8) {
                        val = 8;
                      }
                      changeSpeed(val);
                      this.setState({
                        speed: val,
                      });
                    }}
                    value={speed}
                    aria-label="count of simulated generations"
                  />
                </InputGroup>
              </div>
            </div>
          )}
      </div>
    );
  }
}
App.propTypes = {
  init: PropTypes.func.isRequired,
  changeSpeed: PropTypes.func.isRequired,
  changeLang: PropTypes.func.isRequired,
  startTrain: PropTypes.func.isRequired,
  startGame: PropTypes.func.isRequired,
};
App.defaultProps = {

};
