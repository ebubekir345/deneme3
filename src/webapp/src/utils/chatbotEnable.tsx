import { config } from '../config';
import { roles } from '../auth/roles';
import { chatbotApiKeys } from '../config/config.default';
import useCommonStore from '../store/global/commonStore';

export default function chatbotEnable() {
  const [{}, { userHasMinRole }] = useCommonStore();
  let apiKey;
  let chatBot = document.createElement('script');
  chatBot.setAttribute('type', 'text/javascript');

  apiKey = chatbotApiKeys.common;

  if (userHasMinRole(roles.Supervisor) ) {
    chatBot.innerHTML = `
    var f = function() {
      var t = window;
      if ('function' != typeof t.InfosetChat) {
        var n = document,
          e = function() {
            e.c(arguments);
          };
        (e.q = []),
          (e.c = function(t) {
            e.q.push(t);
          }),
          (t.InfosetChat = e);
        var a = function() {
          var t = n.createElement('script');
          (t.type = 'text/javascript'), (t.async = !0), (t.src = 'https://cdn.infoset.app/chat/icw.js');
          var e = n.getElementsByTagName('script')[0];
          e.parentNode.insertBefore(t, e);
        };
        t.attachEvent ? t.attachEvent('onload', a) : t.addEventListener('load', a, !1);
      }
    };
    f();
      InfosetChat('boot', { widget: { apiKey: '${apiKey}', tags: '${config.env}' } });
    `;
    document.body.appendChild(chatBot);
  }
}
