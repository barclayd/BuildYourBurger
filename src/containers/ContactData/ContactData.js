import React, {Component} from 'react';
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

class ContactData extends Component {

    state = {
       orderForm: {
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
        },
        formIsValid: false
    };

    inputChangedHandler = (event, inputIdentifier) => {

       const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier], {
           value: event.target.value,
           valid: checkValidity(event.target.value, this.state.orderForm[inputIdentifier].validation),
           touched: true
       });

        const updatedOrderForm = updateObject(this.state.orderForm, {
            [inputIdentifier]: updatedFormElement
        } );

       let formIsValid = true;
       for(let inputIdentifier in updatedOrderForm) {
           formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
       }
       this.setState({
           orderForm: updatedOrderForm,
           formIsValid: formIsValid
       });
    };


    orderHandler = (event) => {
        // prevents <form> default to reload page to send a request
        event.preventDefault();
        const formData = {};
        for(let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
                const order = {
                    ingredients: this.props.ingredients,
                    price: this.props.totalPrice,
                    orderData: formData,
                    userId: this.props.userId
        };
        this.props.onOrderBurger(order, this.props.token);
    };

    render() {

        const formElementsArray = [];
        for(let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });

        }

        let form =
            (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)}
                    />
                ))}
                <Button disabled={!this.state.formIsValid} btnType='Success'>PLACE ORDER</Button>
            </form>
            );
        if(this.props.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Please enter delivery information</h4>
                {form}
            </div>

        )
    }

}

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

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));