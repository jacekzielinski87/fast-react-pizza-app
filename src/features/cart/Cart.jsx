import LinkButton from '../../ui/LinkButton';
import Button from '../../ui/Button';
import CartItem from './CartItem';
import EmptyCart from './EmptyCart';
import { useDispatch, useSelector } from 'react-redux';
import { getCart, clearCart } from './cartSlice';





function Cart() {
  const username = useSelector((state)=>state.user.username);
  const cart = useSelector(getCart);
  const dispatch = useDispatch();

  if(!cart.length) return <EmptyCart/>;

  return (
    <div className='px-4 py-3'>
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>

      <h2 className='mt-8 text-xl font-semibold'>Your Cart {username}</h2>

      <ul className='divide-y divide-stone-200 border-b'>
        {cart.map((item) => (
          <CartItem item={item} key={item.pizzaId}/>
        ))}
      </ul>

      <div>
        <Button to="/order/new" type="primary">Order pizzas</Button>
        <Button onClick={() => dispatch(clearCart())}>
          Clear cart
        </Button>
      </div>
    </div>
  )
}

export default Cart;
