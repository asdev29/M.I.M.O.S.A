import { Observable, map } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Item } from '../model';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-list-items-component',
  templateUrl: './list-items-component.component.html',
  styleUrls: ['./list-items-component.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ListItemsComponentComponent implements OnInit {

  items$: Observable<Item[]> = this.service.items$;
  searchTerm = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private service: ItemService
  ) {}

  ngOnInit() {}

  deleteItem(id: number) {
    this.service.deleteItem(id).subscribe(() => console.log('Item deleted'));
  }

  locateItem(id: number) {
    this.service.locateItem(id).subscribe(() => console.log('Item located'));
  }

  goToAdd() {
    this.router.navigate(['/add']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/add', id]);
  }

  searchItems(s: any) {
    if (s) {
      this.items$ = this.service.items$.pipe(
        map(items =>
          items.filter(item =>
            item.name.toLowerCase().includes(s.target.value.toLowerCase())
          )
        )
      );
    } else {
      this.items$ = this.service.items$;
    }
  }




}
