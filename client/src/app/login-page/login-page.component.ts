import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { AuthService } from '../shared/services/auth.service';
import { MaterialService } from '../shared/classes/material.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.sass']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  aSub: Subscription;

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(
        null,
        [
          Validators.required,
          Validators.email
        ]
      ),
      password: new FormControl(
        null,
        [
          Validators.required,
          Validators.minLength(6)
        ]
      )
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        // Now you can enter the system using your data
        MaterialService.toast('Now you can enter the system using your data');
      } else if (params['accessDenied']) {
        // Please sign in the system
        MaterialService.toast('Please sign in the system');
      } else if (params['sessionExpired']) {
        this.auth.logout();
        MaterialService.toast('Please sign in the system again');
      }
    });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  onSubmit() {
    this.form.disable();

    this.aSub = this.auth.login(this.form.value).subscribe(
      () => {
        this.router.navigate(['/overview']);
      },
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }

}
