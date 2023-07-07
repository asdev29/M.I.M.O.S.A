import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ItemService } from '../item.service';
import { Item } from '../model';
import { filter, find, map } from 'rxjs';
@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, FormsModule, CommonModule],
})
export class AddItemComponent implements OnInit {
  itemId?: string | null;
  addItemForm = new FormGroup({
    name: new FormControl('', Validators.required),
    link: new FormControl('', Validators.pattern(/^(ftp|http|https):\/\/[^ "]+$/)),
    image: new FormControl('', Validators.pattern(/^(ftp|http|https):\/\/[^ "]+$/)),
    position: new FormControl('', Validators.required),
    quantity: new FormControl(1, [Validators.required, Validators.min(0)]),
    ip: new FormControl('', Validators.pattern(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)),
  });

  constructor(
    private router: Router,
    private service: ItemService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      this.service.items$
        .pipe(
          map((items: Item[]) =>
            items.filter((item) => item.id === this.itemId)
          )
        )
        .subscribe((items: Item[]) => {
          console.log(items);
          this.addItemForm.patchValue(items[0])
        });
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
