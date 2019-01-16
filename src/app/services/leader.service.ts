import { Injectable } from '@angular/core';
import {LEADERS} from '../shared/leaders';
import {Leader} from '../shared/leader';

@Injectable({
  providedIn: 'root'
})

export class LeaderService {
  getLeaders(): Leader[]{
    return LEADERS;
  }

  getLeader(id: string) : Leader{
    return LEADERS.filter((leader) => (leader.id == id))[0];
  }

  getFeaturedLeader(): Leader {
    return LEADERS.filter((promotion) => promotion.featured)[0];
  }

  constructor() { }
}