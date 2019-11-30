import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CategoriesService } from '../../shared/services/categories.service';
import { MaterialService } from '../../shared/classes/material.service';
import { Category, Message } from '../../shared/interfaces';


@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.sass']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('inputFile', {static: false}) inputFileRef: ElementRef;
  form: FormGroup;
  image: File;
  imagePreview: any = '';
  isNew = true;
  category: Category;

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService,
              private router: Router) { }

  ngOnInit() {

    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    });

    this.form.disable();

    this.route.params.pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              // We edit form
              this.isNew = false;
              return this.categoriesService.getById(params['id']);
            }
            return of(null);
          }
        )
      )
      .subscribe(
        (category: Category) => {
          if (category) {
            this.form.patchValue({
              name: category.name
            });
            MaterialService.updateTextFields();
            this.imagePreview = category.imageSrc;
            this.category = category;

          } else {
            this.isNew = true;
          }
          this.form.enable();
        },
        error => MaterialService.toast(error.error.message)
      );
  }

  triggerClick() {
    this.inputFileRef.nativeElement.click();
  }

  onFileUpload(event: any) {
    this.image = event.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(this.image);
  }

  onSubmit() {
    let obs$;

    this.form.disable();

    if (this.isNew) {
      // Create
      obs$ = this.categoriesService.create(this.form.value.name, this.image);
      this.isNew = false;
    } else {
      // Update
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image);
    }

    obs$.subscribe(
      (category: Category) => {
        this.form.enable();
        this.category = category;
        if (this.isNew) {
          MaterialService.toast('Категория создана');
        } else {
          MaterialService.toast('Данные категории изменены');
        }
      },
      error => {
        this.form.enable();
        MaterialService.toast(error.error.message)
      }
    )
  }

  deleteCategory() {
    const desition = confirm(`Вы уверены, что хотите удалить категорию "${this.category.name}"`);
    this.form.disable();
    if (desition) {
      this.categoriesService.delete(this.category._id)
        .subscribe(
          (message: Message) => {
            MaterialService.toast(message.message);
          },
          error => {
            this.form.enable();
            MaterialService.toast(error.error.message);
          },
          () => {
            this.router.navigate(['/categories']);
          }
        );
    }
  }

}
