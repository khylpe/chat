import { useState, useEffect } from 'react';
import { Chip } from "@nextui-org/react";

function Snackbar({ message, color, duration = 5000 }) {
       const [visible, setVisible] = useState(true);

       useEffect(() => {
              const timer = setTimeout(() => setVisible(false), duration);
              return () => clearTimeout(timer);
       }, [duration]);

       if (!visible) return null;

       return (
              <div className="fixed bottom-8 left-7">
                     <Chip radius='sm' size='lg' color={color}>{message}</Chip>           
              </div>
       );
}

export default Snackbar;
