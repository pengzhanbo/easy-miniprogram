import {remove} from './utils';

let uid = 0;

class Dep {
    static target;

    constructor() {
        this.id = ++uid;
        this.subs = [];
    }

    addSub(sub) {
        this.subs.push(sub);
    }

    removeSub(sub) {
        remove(this.subs, sub);
    }

    depend() {
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    }

    notify() {
        const subs = this.subs.slice();
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update();
        }
    }
}

Dep.target = null;
const targetStack = [];

export function pushTarget(watcher) {
    if (Dep.target) {
        targetStack.push(Dep.target);
    }
    Dep.target = watcher;
}

export function popTarget() {
    Dep.target = targetStack.pop();
}

export default Dep;
