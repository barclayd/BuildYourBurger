import React, { useEffect, Suspense} from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from './store/actions/index';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from "./containers/BuildYourBurger/BurgerBuilder";
import Logout from './containers/Auth/Logout/Logout'

const Checkout = React.lazy(() => {
    return import('./containers/Checkout/Checkout');
});

const Orders = React.lazy(() => {
    return import('./containers/Orders/Orders');
});

const Login = React.lazy(() => {
    return import('./containers/Auth/Auth');
});

const app = props => {

    useEffect(() => {
        props.onTryAutoSignIn();
    }, []);

        let routes = (
            <Switch>
                <Route path='/login' exact  render={() => <Login />}/>
                <Route path='/' exact  component={BurgerBuilder}/>
                <Redirect to='/'/>
            </Switch>
        );

        if (props.isAuthenticated) {
            routes = (
                <Switch>
                    <Route path='/login' exact  render={() => <Login />}/>
                    <Route path='/logout' exact  component={Logout}/>
                    <Route path='/' exact  component={BurgerBuilder}/>
                    <Route path='/checkout' render={() => <Checkout />}/>
                    <Route path='/orders' exact  render={() => <Orders />}/>
                    <Redirect to='/'/>
                </Switch>
            )
        }

    return (
      <div>
        <Layout>
            <Suspense fallback={<p>Loading...</p>}>
            {routes}
            </Suspense>
        </Layout>
      </div>
    );
};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !==null
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignIn: () => dispatch(actions.authCheckState())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(app));
