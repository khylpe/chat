// SnackbarContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import Snackbar from '../components/Snackbar';

const SnackbarContext = createContext();

export const useSnackbar = () => {
       const context = useContext(SnackbarContext);
       if (!context) {
              throw new Error('useSnackbar must be used within a SnackbarProvider');
       }
       return context;
};

export const SnackbarProvider = ({ children }) => {
       const [snackbarState, setSnackbarState] = useState({
              visible: false,
              message: '',
              color: 'default',
              key: 0
       });

       const showSnackbar = useCallback(({ message, color }) => {
              setSnackbarState(state => ({
                     ...state,
                     visible: true,
                     message,
                     color,
                     key: state.key + 1
              }));
       }, []);

       const hideSnackbar = useCallback(() => {
              setSnackbarState(state => ({ ...state, visible: false }));
       }, []);

       const value = {
              snackbarState,
              showSnackbar,
              hideSnackbar
       };

       return (
              <SnackbarContext.Provider value={value}>
                     {children}
                     {snackbarState.visible && (
                            <Snackbar
                                   key={snackbarState.key}
                                   message={snackbarState.message}
                                   color={snackbarState.color}
                            />
                     )}
              </SnackbarContext.Provider>
       );
};
