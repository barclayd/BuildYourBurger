import React from 'react';
import classes from './Order.css';

const order = (props) => (
    <div className={classes.Order}>
        <p>Ingredients: Salad (1)</p>
        <p>Total Order Price:<strong>£4.99</strong></p>
    </div>

);

export default order;
