import { Reducer, useContext, useReducer } from 'react';
import UserContext, { initialState } from './user.context';

import {
  Action,
  IUserState,
  IUserContextProviderProps,
  State,
} from './user.interface';

const languageReducer: Reducer<IUserState, Action> = (
  state: State,
  action: Action
): IUserState => {
  switch (action.type) {
    case 'LOAD_USER': {
      return { ...state, activeUser: action.payload };
    }
    case 'UPDATE_USER': {
      return {
        ...state,
        activeUser: { ...state.activeUser, ...action.payload },
      };
    }
    case 'LOG_OUT': {
      return { ...state, activeUser: initialState.activeUser };
    }
    default:
      return state;
  }
};

function UserContextProvider({
  children,
}: IUserContextProviderProps): JSX.Element {
  const [userState, userDispatch] = useReducer(languageReducer, initialState);
  const value: IUserState = {
    activeUser: userState.activeUser,
    userDispatch,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContextProvider;

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      'useUser must be used as a descendant of UserProvider'
    );
  } else return context;
};
