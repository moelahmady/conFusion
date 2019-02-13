import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service'
import { Comment } from '../shared/comments';
import { visibility, flyInOut, expand } from '../animations/app.animations';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  errMess: string;
  dishcopy: Dish;
  commentForm: FormGroup;
  comment: Comment;
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  @ViewChild('fform') commentFormDirective;
  visibility = 'shown';  


  formErrors = {
    'author': '',
    'rating': '',
    'comment': '',
  };

  validationMessages = {
    'author': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 characters long.',
      'maxlength': 'Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required': 'Comment is required.',
    }
  };

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) {
    this.createForm();
  }

  ngOnInit() {
    this.dishservice.getDishIds()
      .subscribe(dishIds => this.dishIds = dishIds, errmess => this.errMess = <any>errmess);
    this.route.params
      .pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish._id); this.visibility = 'shown'; },
        errmess => this.errMess = <any>errmess)


  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  createForm(): void {

    if(this.currentUser != null){
      console.log(`Curent user:  ${this.currentUser.user.username}`);

      this.commentForm = this.fb.group({
        // author: [`${this.currentUser.user.firstname} ${this.currentUser.user.lastname}`, [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
        rating: ['5', Validators.required],
        comment: ''
      });
    } else{
      this.commentForm = this.fb.group({
        author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
        rating: ['5', Validators.required],
        comment: ''
      });
    }


    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now

  }

  onSubmit() {
    this.comment = this.commentForm.value;
    // let date = new Date();
    // this.comment.date = date.toISOString();
    // this.dishcopy.comments.push(this.comment);
    this.dishservice.postComment(this.dishcopy, this.comment)
      .subscribe(dish => {
        console.log(dish);
        this.dish = dish; this.dishcopy = dish;
      },
        errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
    if(this.currentUser){
      this.commentForm.reset({
        // author: `${this.currentUser.user.firstname} ${this.currentUser.user.lastname}`,
        rating: '5',
        comment: ''
      });
      this.commentFormDirective.resetForm({
        // author: `${this.currentUser.user.firstname} ${this.currentUser.user.lastname}`,
        rating: '5',
        comment: ''
      });
    }else{
      this.commentForm.reset({
        author: '',
        rating: '5',
        comment: ''
      });
      this.commentFormDirective.resetForm({
        author: '',
        rating: '5',
        comment: ''
      });
    }

  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

}
