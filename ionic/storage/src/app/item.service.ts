import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Item } from './model';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private itemsSubject: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>(
    []
  );
  items$: Observable<Item[]> = this.itemsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toastController: ToastController
  ) {
    this.fetchItems().subscribe();
  }

  fetchItems() {
    return this.http
      .get<Item[]>(`${environment.baseUrl}/items`)
      .pipe(tap((items) => this.itemsSubject.next(items)));
  }

  addItem(item: any) {
    return this.http.post<Item>(`${environment.baseUrl}/items`, item).pipe(
      tap((i) => {
        const items = this.itemsSubject.getValue();
        this.itemsSubject.next([...items, i]);
        this.showToast('Item added successfully');
      })
    );
  }

  deleteItem(itemId: number) {
    return this.http.delete(`${environment.baseUrl}/items/${itemId}`).pipe(
      tap(() => {
        const items = this.itemsSubject.getValue();
        this.itemsSubject.next(items.filter((item) => item.id !== itemId));
        this.showToast('Item deleted successfully');
      })
    );
  }

  locateItem(itemId: number) {
    return this.http.get<Item>(environment.baseUrl + `/items/locate/${itemId}`);
  }

  editItem(id: number, updatedItem: any) {
    return this.http
      .put<Item>(`${environment.baseUrl}/items/${id}`, updatedItem)
      .pipe(
        switchMap(() => this.fetchItems()),
        tap((items) => {
          this.itemsSubject.next(items);
          this.showToast('Item updated successfully');
        })
      );
  }

  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    toast.present();
  }
}
