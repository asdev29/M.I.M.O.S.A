import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ItemService } from '../item.service';
import { Item } from '../model';
@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, FormsModule, CommonModule]
})
export class AddItemComponent {
  addItemForm = new FormGroup({
    name: new FormControl(''),
    link: new FormControl(''),
    image: new FormControl(''),
    position: new FormControl(''),
    quantity: new FormControl(''),
    ip: new FormControl('')
  });

  constructor(private http: HttpClient, private router: Router, private service: ItemService) {}

  onSubmit() {
    this.service.addItem(this.addItemForm.value).subscribe(() =>   this.router.navigate(['/list']));

  }

}
