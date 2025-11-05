import loading from "../JLoading/JLoading.js"
export default {
    install(app){
        app.directive('loading',loading)
    }
}