import React from 'react';
import {connect} from 'react-redux';
import BuildControl from './BuildControl/BuildControl';
import classes from './BuildControls.css';

const controls = [
    { label: 'Salad', type: 'salad' },
    { label: 'Bacon', type: 'bacon' },
    { label: 'Cheese', type: 'cheese' },
    { label: 'Meat', type: 'meat' },
];

const buildControls = (props) => (
    <div className={classes.BuildControls}>
        <p>Current Price: <strong>£{Number.parseFloat(props.price).toFixed(2)}</strong></p>
        {controls.map(ctrl => (
            <BuildControl
                key={ctrl.label}
                label={ctrl.label}
                added={() => props.increaseIngredient(ctrl.type)}
                removed={() => props.decreaseIngredient(ctrl.type)}
                disabled={props.disabled[ctrl.type]}/>
        ))}
        <button
            className={classes.OrderButton}
            onClick={props.ordered}
            disabled={!props.purchasable}>
            {props.isAuth ? 'ORDER NOW' : 'Sign up to Order'}
        </button>
    </div>
);

const mapStateToProps = state => {
    return {
        totalPrice: state.totalPrice
    }
};

export default connect(mapStateToProps)(buildControls);
