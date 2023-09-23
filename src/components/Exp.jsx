import React, { useEffect } from 'react';

const Exp = () => {
  useEffect(() => {
    // Cargar y ejecutar el script de Three.js
    const script = document.createElement('script');
    script.src = '/src/assets/main.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Limpiar el script al desmontar el componente
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: `
      <iframe src="/src/assets/index.html" style="width: 100%; height: 100%; margin: 0px; position: fixed; top: 0px; border: none;
;
      padding: 0px;
  "></iframe>
    ` }} />
  );
};
export default Exp;