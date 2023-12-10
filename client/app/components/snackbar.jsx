// Snackbar.js
import { useEffect } from 'react';
import { Chip } from "@nextui-org/react";
import { useSnackbar } from '../contexts/SnackbarContext';

function Snackbar({ message, color }) {
       const { hideSnackbar } = useSnackbar();

       useEffect(() => {
              const timer = setTimeout(() => {
                     hideSnackbar();
              }, 5000);

              return () => clearTimeout(timer);
       }, [hideSnackbar]);

       return (
              <div className="fixed bottom-8 left-7">
                     <Chip radius='sm' size='lg' color={color}>{message}</Chip>
              </div>
       );
}

export default Snackbar;
