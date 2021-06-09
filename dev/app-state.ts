import { observable, action, computed, makeObservable } from 'mobx'
import { persist } from '../src'
import { serializable } from 'serializr'

// useStrict(true)

export class Item {
  @serializable prop = 1
  @serializable added = 3
  get item() {
    return this.prop + this.added
  }
}

export class BaseState {

}


class AppState extends BaseState
{
  @persist timer: any = 0
  @persist('list') list: number[] = [2, 22]
  @persist('list', Item) classList: Item[] = []
  @persist('list') objectList: any[] = [{ test: 1 }, null, undefined, [1]]
  @persist('map', Item) map = observable.map<Item>({})
  @persist('object', Item) item = new Item
  @persist('object') date: Date = new Date()

  constructor() {
    super()
    makeObservable(this, {
      timer: observable,
      list: observable,
      classList: observable,
      objectList: observable,
      map: observable,
      item: observable,
      date: observable,
      counts: computed,
      count: computed,
      add: action,
      inc: action,
      put: action
    });
    setInterval(this.inc.bind(this), 2000);
  }
  get counts() {
    return this.classList.reduce((prev, value) => prev + value.item, 0)
  }
  get count() {
    return this.timer - 10
  }
  add() {
    this.classList.push(new Item)
  }
  inc() {
    this.timer += 1;
  }
  put() {
    this.list.push(this.timer)
  }
  resetTimer() {
    this.timer = 0
    this.list = []
  }
}

export default AppState;
