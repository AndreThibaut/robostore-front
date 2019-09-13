import React from 'react';
import axios from 'axios';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
class App extends React.Component {

  constructor(props){
    super(props);

    this.toggle = this.toggle.bind(this);
    this.select = this.select.bind(this);
    this.toggleId = this.toggleId.bind(this);
    this.selectId = this.selectId.bind(this);
    this.state = {
      robots: [],
      foundRobot: [],
      newRobotModal: false,
      listRobotModal: false,
      findRobotModal: false,
      dropdownOpen: false,
      idDropdownOpen: false,
      value: "SelectTask",
      task:"Select Task",
      newRobot: { task: ""},
      robotID: 'ID'
    }
  }
  componentWillMount() {
    const url = 'http://localhost:8080/robots';
    axios.get(url)
      .then(response => {
        this.setState({
          robots: response.data
        })
      });
  }

  toggle(){
    this.setState(prevState => ({
        dropdownOpen: !prevState.dropdownOpen
    }));
  }

  toggleId(){
    this.setState(prevState => ({
        idDropdownOpen: !prevState.idDropdownOpen
    }));
  }

  toggleNewRobotModal(){
    this.setState({
      newRobotModal: !this.state.newRobotModal
    });
  }

  toggleListRobotModal(){
    this.setState({
      listRobotModal: !this.state.listRobotModal
    });
  }

  toggleFindRobotModal(){
    this.setState({
      findRobotModal: !this.state.findRobotModal
    });
  }

  select(event){
    let newRobot = this.state;
    newRobot.task = event.target.innerText;
    this.toggle();
    this.setState({
      value: event.target.innerText,
      newRobot
    });
  }

  selectId(event){
    let robotID = this.state;
    robotID = event.target.innerText;
    this.setState(
      {
        idDropdownOpen: !this.state.idDropdownOpen,
        robotID
      }
    );
  }

  addRobotToStore(e){
    axios.post('http://localhost:8080/robots', this.state.newRobot).then(
      (response) => {
        let {robots} = this.state;
        robots.push(response.data);

        this.setState({robots});
      }
    );
  }

  deleteRobot(id){
    axios.delete('http://localhost:8080/robots/' + id).then((response) => {

      this._refreshList();
    }
    );
  }

  findRobot(id){
    console.log(id)
    axios.get('http://localhost:8080/robots/' + id).then(
      (response) => {

      console.log(response.data)
      
      let {foundRobot} = this.state;
      foundRobot.length = 0;
      foundRobot.push(response.data);

      this.setState(foundRobot); 
  });
  }

  _refreshList(){
    const url = 'http://localhost:8080/robots';
    axios.get(url)
      .then(response => {
        this.setState({
          robots: response.data
        })
      });
  }

  render() {

    let robots = this.state.robots.map(robot => {
      return (
        <tr key={robot.id}>
          <td>{robot.id}</td>
          <td>{robot.task}</td>
          <td><Button color='danger' size='sm' onClick={this.deleteRobot.bind(this, robot.id)}>Delete</Button></td>
        </tr>
      )
    });

    let robotList = this.state.robots.map( robot => {
      return(
        <DropdownItem onClick={this.selectId}>{robot.id}</DropdownItem>
      )
    });

    let foundRobot = this.state.foundRobot.map( robot => {
        return (
          <tr key={robot.id}>
            <td>{robot.id}</td>
            <td>{robot.task}</td>
          </tr>
        )
    });

    return (
      <div className="App Container">
        
        <Button color="primary" onClick={this.toggleNewRobotModal.bind(this)}>Add Robot</Button>
        <Modal isOpen={this.state.newRobotModal} toggle={this.toggleNewRobotModal.bind(this)}>
          <ModalHeader toggle={this.toggleNewRobotModal.bind(this)}>Add Robot</ModalHeader>
            <ModalBody>
              <InputGroup>

                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                  <DropdownToggle caret placeholder="Select Type">{this.state.value}</DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem header>Choose Type</DropdownItem>
                      <DropdownItem onClick={this.select}>Transport</DropdownItem>
                      <DropdownItem onClick={this.select}>Drilling</DropdownItem>
                      <DropdownItem onClick={this.select}>Welding</DropdownItem>
                      <DropdownItem onClick={this.select}>Patrol</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                
              </InputGroup>
            </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addRobotToStore.bind(this)}>Add Robot</Button>{' '}
            <Button color="secondary" onClick={this.toggleNewRobotModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Button color="info" onClick={this.toggleListRobotModal.bind(this)}>List of all Robots</Button>
        <Modal scrollable isOpen={this.state.listRobotModal} toggle={this.toggleListRobotModal.bind(this)}>
          <ModalHeader toggle={this.toggleListRobotModal.bind(this)}>List of all Robots</ModalHeader>
          <ModalBody>
            <Table hover>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Task</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {robots}
              </tbody>

            </Table>
          </ModalBody>
        </Modal>

        <Button color="info" onClick={this.toggleFindRobotModal.bind(this)}>Find Robot by Id</Button>
        <Modal isOpen={this.state.findRobotModal} toggle={this.toggleFindRobotModal.bind(this)}>
          <ModalHeader toggle={this.toggleFindRobotModal.bind(this)}>Find Robot by ID</ModalHeader>
          <ModalBody>
            <InputGroup>
              <Dropdown isOpen={this.state.idDropdownOpen} toggle={this.toggleId}>
                <DropdownToggle caret>{this.state.robotID}</DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>Robot Ids</DropdownItem>
                    {robotList}
                  </DropdownMenu>
                
              </Dropdown>
              <Button color="primary" onClick={this.findRobot.bind(this, this.state.robotID)}>Find Robot</Button>{' '}
              <Button color="secondary" onClick={this.toggleFindRobotModal.bind(this)}>Cancel</Button>
            </InputGroup>
            <Table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Task</th>
                  </tr>
                </thead>
                <tbody>{foundRobot}</tbody>
            </Table>
          </ModalBody>
        </Modal>

      </div>
        );
      }
  }
  
  export default App;
