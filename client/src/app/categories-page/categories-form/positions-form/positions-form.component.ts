import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { PositionsService } from '../../../shared/services/positions.service';
import { Message, Position } from '../../../shared/interfaces';
import { MaterialInstance, MaterialService } from '../../../shared/classes/material.service';


@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.sass'],
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('categoryId') categoryId: string;
  @ViewChild('showModal', {static: false}) showModalRef: ElementRef;
  form: FormGroup;
  positions: Position[] = [];
  loading = false;
  modal: MaterialInstance;
  positionId = null;

  constructor(private positionService: PositionsService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null,
        [
          Validators.required,
          Validators.min(0.01)])
    });

    this.loading = true;
    this.positionService.fetch(this.categoryId).subscribe(
      (positions: Position[]) => {
        this.positions = positions;
        this.loading = false;
      },
      error => MaterialService.toast(error.error.message)
    );
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.showModalRef);
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost,
    });
    MaterialService.updateTextFields();
    this.modal.open();
  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const desition = confirm(`Вы уверены, что хотите удалить позицию "${position.name}"`);
    if (desition) {
      this.positionService.delete(position._id)
        .subscribe(
        (message: Message) => {
          MaterialService.toast(message.message);
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions.splice(idx, 1);
        },
        error => MaterialService.toast(error.error.message)
      )
    }

  }

  onAddPosition() {
    this.positionId = null;
    this.form.reset();
    this.modal.open();
  }

  onCancelModal() {
    this.modal.close();
  }

  onSubmit() {
    this.form.disable();

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId,
    };

    const completed = () => {
      this.form.enable();
      this.form.reset();
      this.modal.close();
    };

    const errored = error => MaterialService.toast(error.error.message);

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionService.update(newPosition).subscribe(
        (position: Position) => {
          MaterialService.toast('Позиция успешно обновлена');
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions[idx] = position;
        },
        errored,
        completed
      );
    } else {
      this.positionService.create(newPosition).subscribe(
        (position: Position) => {
          MaterialService.toast('Позиция успешно создана');
          this.positions.push(position);
        },
        errored,
        completed
      );
    }
  }

}
