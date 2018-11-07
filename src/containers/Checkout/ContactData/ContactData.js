import React, {Component} from 'react';
import axios from '../../../axios-orders';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import classes from './ContactData.css'

class ContactData extends Component {

    state = {
       orderForm: {
               name: {
                   elementType: 'input',
                   elementConfig: {
                        type: 'text',
                        placeholder: 'Your Name'
                   },
                   value: '',
                   validation: {
                       required: true
                   },
                   valid: false
               },
               street: {
                   elementType: 'input',
                   elementConfig: {
                       type: 'text',
                       placeholder: 'Street'
                   },
                   value: '',
                   validation: {
                       required: true
                   },
                   valid: false
               },
               postcode: {
                   elementType: 'input',
                   elementConfig: {
                       type: 'text',
                       placeholder: 'POSTCODE'
                   },
                   value: '',
                   validation: {
                       required: true,
                       minLength: 5,
                       maxLength: 8
                   },
                   valid: false
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
                   valid: false
               },
               email: {
                   elementType: 'input',
                   elementConfig: {
                       type: 'email',
                       placeholder: 'email'
                   },
                   value: '',
                   validation: {
                       required: true
                   },
                   valid: false
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
                    value: ''
                }
        },
        loading: false
    };

    static checkValidity(value, rules) {
        let isValid = true;

        if(rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }
        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };
       const updatedFormElement = {
           ...updatedOrderForm[inputIdentifier]
       };
       updatedFormElement.value = event.target.value;
       updatedOrderForm[inputIdentifier] = updatedFormElement;
       updatedFormElement.valid = ContactData.checkValidity(updatedFormElement.value, updatedFormElement.validation);
       console.log(updatedFormElement);
       this.setState({
           orderForm: updatedOrderForm
       });
    };


    orderHandler = (event) => {
        // prevents <form> default to reload page to send a request
        event.preventDefault();
        this.setState({
                    loading: true
                });
        const formData = {};
        for(let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
                // alert('You have chosen to continue!');
                const order = {
                    ingredients: this.props.ingredients,
                    price: this.props.price,
                    orderData: formData
        };
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({
                    loading: false
                });
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({
                    loading: false
                });
            })
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
                        changed={(event) => this.inputChangedHandler(event, formElement.id)}
                    />
                ))}
                <Button btnType='Success'>PLACE ORDER</Button>
            </form>
            );
        if(this.state.loading) {
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
export default ContactData;
