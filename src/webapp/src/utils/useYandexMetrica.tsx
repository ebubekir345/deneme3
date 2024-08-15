import { useEffect } from 'react';
import { config } from '../config';

const useYandexMetrica = () => {
  if (!config.isProduction) {
    return;
  }
  useEffect(() => {
    const script = document.createElement('script');

    script.type = 'text/javascript';
    script.innerHTML =
      "(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym'); ym(75863383, 'init', { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true});";

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);
};

export default useYandexMetrica;