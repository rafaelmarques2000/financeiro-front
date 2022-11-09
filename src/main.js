import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.js"
import "../src/assets/reset.css"
import "../src/assets/app.css"

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
    faArrowLeft
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
    faArrowLeft
)

createApp(App).use(store)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(router)
    .mount('#app')
