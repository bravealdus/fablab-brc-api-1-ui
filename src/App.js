import React from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import './bootstrap.css';

class App extends React.Component {

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);
    const { cookies } = props;

    this.state = {
      editing: !cookies.get('user_email') || !cookies.get('user_email'),
      user_email: cookies.get('user_email'),
      project_title: cookies.get('project_title'),
      project_status: cookies.get('project_status') || 'incubando',
      doneCheckIn: false,
      lastCheckIn: {},
    };
  }

  
  checkIn() {
    const { cookies } = this.props;

    this.setState({ editing: false });
    cookies.set('user_email', this.state.user_email, { path: '/' });
    cookies.set('project_title', this.state.project_title, { path: '/' });
    cookies.set('project_status', this.state.project_status, { path: '/' });

    const data = {
      'user_email': this.state.user_email,
      'project_title': this.state.project_title 
    }
    fetch('http://localhost:5000/check-in', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then(res => res.json())
      .then(json => this.setState({
        doneCheckIn: true,
        lastCheckIn: json.result
      }));
  }

  renderEdition() {
    if (this.state.editing) {
      return (
        <div>
          <input type="text" placeholder="Email" value={this.state.user_email}
            onChange={(e) => this.setState({user_email: e.target.value})} />

          <input type="text" placeholder="Projecto (opcional)" value={this.state.project_title}
            onChange={(e) => this.setState({project_title: e.target.value})} />
        </div>
      )
    }
  }

  renderFilledInputs() {
    if (!this.state.editing) {
      return  (
        <div className='text-left'>
          <br />
          <div className="h5 mb-3 font-weight-normal">
            email: <strong>{this.state.user_email}</strong>
          </div>
          <div className="h5 mb-3 font-weight-normal">
            proyecto: <strong>{this.state.project_title}</strong>
          </div>
          <br />
        </div>
      )
    }
  }

  renderCheckInButton() {
    return (
      <button 
        onClick={() => this.checkIn()} 
        className="btn btn-lg btn-warning float-right">
        Check In
      </button>
    )
  }

  renderEditButton() {
    if (this.state.editing) return;
    return (
      <button 
        onClick={() => this.setState({editing: !this.state.editing})} 
        className="btn btn-lg btn-primary">
        Editar
      </button>
    )
  }

  renderDoneCheckIn() {
    if (!this.state.doneCheckIn) return;
    return (
      <div className="text-center">
        <span className="h1">Gracias!</span>
        <div>
          Tu check-in fue echo: {this.state.lastCheckIn.date}
        </div>
      </div>
    )
  }

  renderButtons() {
    if (this.state.doneCheckIn) return;
    return (
      <div>
        { this.renderEditButton() }
        { this.renderCheckInButton() }
      </div>
    )
  }

  renderSelectStaus() {
    return (
      <select className="form-control" value={this.state.project_status}
        onChange={(e) => this.setState({project_status: e.target.value})} >
        <option value="incubando">Incubando</option>
        <option value="coworking">Coworking</option>
        <option value="charla">Charla o Meetup</option>
      </select>
    )
  }

  render() {
    return (
      <div className="main">

        <div className="card">
          <div className="card-header">
            <h1 className="h3 text-center">FabLab Check-In</h1>
          </div> 
          <div className="card-body">
            { this.renderEdition() }
            { this.renderFilledInputs() }
            { this.renderSelectStaus() }
            <br />
            { this.renderButtons() }
            <br /><br />
            { this.renderDoneCheckIn() }
          </div> 
        </div>

        
      </div>
    );
  }
}



export default withCookies(App);

