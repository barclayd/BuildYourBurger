import React, {useState} from 'react';
import { connect } from 'react-redux';
import {updateObject} from "../../store/utility";
import * as orderActions from '../../store/actions';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import Input from '../../components/UI/Input/Input';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import classes from './ContactData.css'
import {checkValidity} from "../../shared/utility";

const contactData = props => {

    const [orderForm, setOrderForm] = useState({
               name: {
                   elementType: 'input',
                   elementConfig: {
                        type: 'text',
                        placeholder: 'Name'
                   },
                   value: '',
                   validation: {
                       required: true
                   },
                   valid: false,
                   touched: false
               },
               street: {
                   elementType: 'input',
                   elementConfig: {
                       type: 'text',
                       placeholder: 'Address'
                   },
                   value: '',
                   validation: {
                       required: true
                   },
                   valid: false,
                   touched: false
               },
               postcode: {
                   elementType: 'input',
                   elementConfig: {
                       type: 'text',
                       placeholder: 'Postcode'
                   },
                   value: '',
                   validation: {
                       required: true,
                       minLength: 5,
                       maxLength: 8
                   },
                   valid: false,
                   touched: false
               },
               country: {
                   elementType: 'input',
                   elementConfig: {
                       type: 'text',
                       placeholder: 'Country'
                   },
                   value: '',
                   validation: {
                       required: true
                   },
                   valid: false,
                   touched: false
               },
               email: {
                   elementType: 'input',
                   elementConfig: {
                       type: 'email',
                       placeholder: 'Email address'
                   },
                   value: '',
                   validation: {},
                   valid: false,
                   touched: false
               },
                deliveryMethod: {
                    elementType: 'select',
                    elementConfig: {
                        options: [{
                            value: 'deliveroo',
                            displayValue: 'Deliverroo'
                        }, {
                            value: 'ubereats',
                            displayValue: 'Uber Eats'
                        },
                            {
                                value: 'localpickup',
                                displayValue: 'Pickup in Store'
                            }]
                    },
                    validation: {
                        required: false
                    },
                    value: 'localpickup',
                    valid: true
                }
        });

    const [formIsValid, setFormValidity] = useState(false);

    const inputChangedHandler = (event, inputIdentifier) => {

       const updatedFormElement = updateObject(orderForm[inputIdentifier], {
           value: event.target.value,
           valid: checkValidity(event.target.value, orderForm[inputIdentifier].validation),
           touched: true
       });

        const updatedOrderForm = updateObject(orderForm, {
            [inputIdentifier]: updatedFormElement
        } );

       let formIsValid = true;
       for(let inputIdentifier in updatedOrderForm) {
           formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
       }
       setOrderForm(updatedOrderForm);
       setFormValidity(formIsValid);
    };


    const orderHandler = (event) => {
        event.preventDefault();
        const formData = {};
        for(let formElementIdentifier in orderForm) {
            formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
        }
                const order = {
                    ingredients: props.ingredients,
                    price: props.totalPrice,
                    orderData: formData,
                    userId: props.userId
        };
        props.onOrderBurger(order, props.token);
    };

        const formElementsArray = [];
        for(let key in orderForm) {
            formElementsArray.push({
                id: key,
                config: orderForm[key]
            });

        }

        let form =
            (
            <form onSubmit={orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => inputChangedHandler(event, formElement.id)}
                    />
                ))}
                <Button disabled={!formIsValid} btnType='Success'>PLACE ORDER</Button>
            </form>
            );
        if(props.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Please enter delivery information</h4>
                {form}
            </div>

        )
};

const mapStateToProps = state => {
    return {
        totalPrice: state.burgerBuilder.totalPrice,
        ingredients: state.burgerBuilder.ingredients,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(orderActions.purchaseBurger(orderData, token))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(contactData, axios));
