import React, { createContext, useContext, useReducer } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const initialState = [];

  const notificationReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_NOTIFICATION':
        return [...state, action.payload];
      default:
        return state;
    }
  };

  const [notifications, dispatch] = useReducer(notificationReducer, initialState);

  const addNotification = (notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};