import { Injectable } from '@angular/core';

import { OrderPosition, Position } from '../shared/interfaces';

@Injectable()
export class OrderService {

  public list: OrderPosition[] = [];
  public price: number = 0;

  constructor() {}

  add(position: Position) {
    //this.price += position.cost * position.quantity;

    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id,
    });

    const candidate = this.list.find(p => p._id === orderPosition._id);

    if (candidate) {
      // Change quantity
      candidate.quantity += orderPosition.quantity;
    } else {
      // Add new position
      this.list.push(orderPosition);
    }

    this.computePrice();
  }

  delete(orderPosition: OrderPosition) {
    const index = this.list.findIndex(p => p._id === orderPosition._id);
    this.list.splice(index, 1);

    this.computePrice();
  }

  clear() {
    this.list = [];
    this.price = 0;
  }

  private computePrice() {
    this.price =  this.list.reduce((total, item) => {
      return item.quantity * item.cost + total;
    }, 0);
  }

}
