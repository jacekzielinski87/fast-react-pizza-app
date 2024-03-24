/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react';
import { Form, redirect, useNavigation, useActionData } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import { useSelector } from 'react-redux';
import {clearCart, getCart} from '../cart/cartSlice';
import EmptyCart from '../cart/EmptyCart';
import store from '../../store';
import { getTotalCartPrice } from '../cart/cartSlice';
import { formatCurrency } from '../../utilitis/helpers';


// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );


function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const username = useSelector((state)=>state.user.username);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const formErrors = useActionData();
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  if(!cart.length) return <EmptyCart/>

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-bold">Ready to order? Lets go!</h2>

      <Form method="POST">
        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className='sm:basis-40'>First Name</label>
          <input className='input grow' type="text" name="customer" defaultValue={username} required />
        </div>

        <div className='mb-5 flex gap-2 flex-col sm:flex-row sm:items-center'>
          <label>Phone number</label>
          <div>
            <input type="tel" name="phone" required />
          </div>
          {formErrors?.phone && <p>{formErrors.phone}</p>}
        </div>

        <div className='mb-5 flex gap-2 flex-col sm:flex-row sm:items-center'>
          <label>Address</label>
          <div>
            <input
              className="tranistion-all w-full rounded-full 
              border border-stone-200 px-4 py-2 text-sm
             duration-300
              placeholder:text-stone-500 focus:outline-none
             focus:ring focus:ring-yellow-400 md:px-6 md:py-3"
              type="text"
              name="address"
              required
            />
          </div>
        </div>

        <div className='mb-12 flex gap-5 items-center'>
          <input
            className="h-6 w-6 accent-yellow-400
            focus:outline-none focus:ring
            focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className='font-medium'>Want to yo give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />

          <Button disabled={isSubmitting} type="primary">
            {isSubmitting 
            ? 'Placing Order...' 
            : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };

  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      'Please give us your correct phone number. We might need it to contact to You.';

  if (Object.keys(errors).length > 0) return errors;

  
  //If evertyhing is okey create new order and redirect

  const newOrder = await createOrder(order);


  //Do not overuse
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
