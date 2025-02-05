import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  clearOrderModalData,
  createOrderThunk,
  selectOrderConstructor,
  setOrderRequest
} from '../../services/slices/orderConstructorSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderConstructorState = useSelector(selectOrderConstructor);
  const constructorItems = orderConstructorState.ingredients;

  //доделать
  const orderRequest = orderConstructorState.orderRequest;
  const orderModalData = orderConstructorState.orderModalData;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (constructorItems.bun) navigate('/login');
  };
  const closeOrderModal = () => {
    dispatch(setOrderRequest(false));
    dispatch(clearOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.toppings.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
