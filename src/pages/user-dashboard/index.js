import { Component } from 'react';
import { connect } from 'dva';
import Users from './components/Users';

class userDashboard extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'user-dashboard/fetch',
      payload: {
        page: 1,
      },
    });
  }

  render() {
    return (
      <div>
        <Users />
      </div>
    );
  }
}

export default connect()(userDashboard);
