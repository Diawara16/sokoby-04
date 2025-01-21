import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

export const useAppState = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state);
  return { dispatch, state };
};