/*
 * @Author: Eduardo Policarpo
 * @contact: +55 43996611437
 * @Date: 2021-05-20 18:05:16
 * @LastEditTime: 2021-06-07 03:18:22
 */

// * Engines
// import whatsappwebjs from "./engines/WhatsappWebJS.js";
// import venom from "./engines/Venom.js";
import whatsconnet from "./engines/WppConnect.js";

// * Routes
// import routeWhatsappwebjs from "./routers/WhatsappWebJS.js";
// import routeVenom from "./routers/Venom.js";
import routeWhatsconnet from "./routers/WppConnect.js";

export default {
    // 1: {
    //     descricao: "Whatsapp-Web-JS",
    //     motor: whatsappwebjs,
    //     router: routeWhatsappwebjs.Router,
    // },
    2: {
        descricao: "WPPConnect",
        motor: whatsconnet,
        router: routeWhatsconnet.Router,
    },
    // 3: {
    //     descricao: "Venom-bot",
    //     motor: venom,
    //     router: routeVenom.Router,
    // },
};