import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Item } from './model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private itemsSubject: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  items$: Observable<Item[]> = this.itemsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchItems();
  }

  fetchItems() {
    this.http.get<Item[]>(`${environment.baseUrl}/items`)
      .pipe(tap(items => this.itemsSubject.next(items)))
      .subscribe();
  }

  addItem(item: any) {
    return this.http.post<Item>(`${environment.baseUrl}/items`, item)
      .pipe(tap(i => {
        const items = this.itemsSubject.getValue();
        this.itemsSubject.next([...items, i]);
      }));
  }

  deleteItem(itemId: number) {
    return this.http.delete(`${environment.baseUrl}/items/${itemId}`)
      .pipe(tap(() => {
        const items = this.itemsSubject.getValue();
        this.itemsSubject.next(items.filter(item => item.id !== itemId));
      }));
  }

  locateItem(itemId: number) {
    // Assuming your server returns the updated item after the locate action
    return this.http.get<Item>(environment.baseUrl+`/items/locate/${itemId}`)
      .pipe(tap(updatedItem => {
        const items = this.itemsSubject.getValue();
        const updatedItems = items.map(item => item.id === updatedItem.id ? updatedItem : item);
        this.itemsSubject.next(updatedItems);
      }));
  }

  editItem(updatedItem: Item) {
    return this.http.put<Item>(`${environment.baseUrl}/items/${updatedItem.id}`, updatedItem)
      .pipe(tap(updatedItem => {
        const items = this.itemsSubject.getValue();
        const updatedItems = items.map(item => item.id === updatedItem.id ? updatedItem : item);
        this.itemsSubject.next(updatedItems);
      }));
  }
}
