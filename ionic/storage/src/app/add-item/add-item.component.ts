import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ItemService } from '../item.service';
import { Item } from '../model';
import { filter, find } from 'rxjs';
@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, FormsModule, CommonModule],
})
export class AddItemComponent implements OnInit {
  itemId?: number | null;
  addItemForm = new FormGroup({
    name: new FormControl(''),
    link: new FormControl(''),
    image: new FormControl(''),
    position: new FormControl(),
    quantity: new FormControl(1),
    ip: new FormControl(''),
  });

  constructor(
    private router: Router,
    private service: ItemService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.itemId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.itemId) {
      this.service.items$
        .pipe(
          filter((items: Item[]) =>
            items.some((item) => item.id === this.itemId)
          )
        )
        .subscribe((items: Item[]) => this.addItemForm.patchValue(items[0]));
    }
  }

  onSubmit() {
    if (this.itemId) {
      this.service
        .editItem(this.itemId, this.addItemForm.value)
        .subscribe(() => this.router.navigate(['/list']));
    } else {
      this.service
        .addItem(this.addItemForm.value)
        .subscribe(() => this.router.navigate(['/list']));
    }
  }

  back() {
    this.router.navigate(['/list']);
  }
}
