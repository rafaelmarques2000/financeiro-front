import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"
import "../src/assets/reset.css"
import "../src/assets/app.css"
import 'v-calendar/dist/style.css';

/* import the fontawesome core */
import {library} from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
    faChartColumn,
    faFilter,
    faHome,
    faPenToSquare,
    faPlusCircle,
    faReceipt,
    faRightFromBracket,
    faSackDollar,
    faSearch,
    faTrash,
    faArrowLeft,
    faArrowRight,
    faCreditCard,
    faChartLine, faPiggyBank, faMoneyBill
} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(
    faHome,
    faReceipt,
    faSackDollar,
    faRightFromBracket,
    faChartColumn,
    faPlusCircle,
    faFilter,
    faPenToSquare,
    faTrash,
    faSearch,
    faArrowLeft,
    faArrowRight,
    faCreditCard,
    faChartLine,
    faPiggyBank,
    faMoneyBill
)

import VCalendar from 'v-calendar';

createApp(App)
    .use(store)
    .use(VCalendar)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(router)
    .mount('#app')
