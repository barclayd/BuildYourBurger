import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem';
import classes from './NavigationItems.css';

const navigationItems = (props) => (

    // let tab = 'Login';
    // if (props.isAuthenticated) {
    //     tab = 'Logout'
    // }
        <ul className={classes.NavigationItems}>
            <NavigationItem
                link='/'
                exact>
                Burger Builder
            </NavigationItem>
            <NavigationItem
                link='/orders'>
                Orders
            </NavigationItem>
            {!props.isAuthenticated ?
                <NavigationItem link='/login'>Login</NavigationItem> :
                <NavigationItem link='/logout'>Logout</NavigationItem>}
        </ul>
);

export default navigationItems;
