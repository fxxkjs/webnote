import { Button, Dialog, Upload, Input, Message, MessageBox, Notification } from 'element-ui';

const element = {
    install: function (Vue) {
        Vue.use(Button)
        Vue.use(Dialog)
        Vue.use(Upload)
        Vue.use(Input)

        Vue.prototype.$message = Message;
        Vue.prototype.$msgbox = MessageBox;
        Vue.prototype.$alert = MessageBox.alert;
        Vue.prototype.$confirm = MessageBox.confirm;
        Vue.prototype.$prompt = MessageBox.prompt;
        Vue.prototype.$notify = Notification;
    }
}

export default element