import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { catchError, delay, map, switchMap, tap, timeout } from 'rxjs/operators';
import { Item } from './model';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private itemsSubject: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>(
    []
  );
  items$: Observable<Item[]> = this.itemsSubject.asObservable();

  private firestore = inject(Firestore);

  constructor(
    private http: HttpClient,
    private toastController: ToastController
  ) {
    this.fetchItems().subscribe();
  }

  fetchItems(): Observable<Item[]> {
    const ref = collection(this.firestore, 'led');
    return collectionData(ref,{idField: 'id'}).pipe(
      tap((items) => console.log(items)),
      map((transactions: any) =>
        transactions.map((t: any) => {
          return {
            name: t['name'],
            id: t['id'],
            link: t['link'],
            image: t['image'],
            position: t['position'],
            quantity: t['quantity'],
            ip: t['ip'],
          } as Item;
        })
      ),
      tap((items) => this.itemsSubject.next(items))
    );
  }

  increaseQuantity(item: Item) {
    item.quantity++;
    return this.editItem(item.id, item);
  }

  decreaseQuantity(item: Item) {
    if(item.quantity > 0) {
      item.quantity--;
      return this.editItem(item.id, item);
    }
    this.showToast('Quantity cannot be less than 0', "danger");
    throw  Error('Quantity cannot be less than 0');
  }

  addItem(item: any){
    const ref = collection(this.firestore, 'led');
    const data = {
      name: item.name,
      link: item.link,
      image: item.image,
      position: item.position,
      quantity: item.quantity,
      ip: item.ip,
    };

    return from(addDoc(ref, data)).pipe(
      tap((docRef) => {
        item.id = docRef.id;
        const currentItems = this.itemsSubject.value;
        currentItems.push(item);
        this.itemsSubject.next(currentItems);
        this.showToast('Item added successfully');
      }),
      catchError((error) => {
        this.showToast('Something went wrong', "error");
        throw error;
      }),
    );
  }


  deleteItem(itemId: string): Observable<void> {
    const itemRef = doc(this.firestore, 'led', itemId);

    return from(deleteDoc(itemRef)).pipe(
      tap(() => {
        console.log('Document successfully deleted');
        const currentItems = this.itemsSubject.value;
        const index = currentItems.findIndex(i => i.id === itemId);
        if (index !== -1) {
          currentItems.splice(index, 1); // Remove the item from the items array
          this.itemsSubject.next(currentItems);  // Update the items subject
          this.showToast('Item deleted successfully');
        }
      }),
      catchError((error) => {
        this.showToast('Error deleting document', "error");
        throw error;
      }),
    );
  }

  locateItem(item: any) {
    let position = item['position'];
    let ip = item['ip'];
    let start_num = position- 1
    return this.send_request(ip, start_num, position, [255, 255, 255]).pipe(
      timeout(10000),
      catchError(error => {
        this.showToast('Error occurred during the first request:', "danger");
        throw error;
      }),
      delay(5000),
      switchMap(() => this.send_request(ip, 0, 60, [0, 255, 0]).pipe(
        timeout(10000),
        catchError(error => {
          this.showToast('Error occurred during the second request:', "danger");
          throw error;
        })
      ))
    );
  }

  send_request(target_ip: any, start_num: any, stop_num: any, color: any) {
    const url = 'http://'+target_ip+'/json/state'
    const state = {"seg": [{"id": 0, "start": start_num, "stop": stop_num, "col": [color]}]}
    return this.http.post(url, state);
  }



  editItem(id: string, item: any): Observable<void> {
    const itemRef = doc(this.firestore, 'led', id);
    const data = {
      name: item.name,
      link: item.link,
      image: item.image,
      position: item.position,
      quantity: item.quantity,
      ip: item.ip,
    };

    // updateDoc returns a Promise, so we convert it to an Observable
    return from(updateDoc(itemRef, data)).pipe(
      tap(() => {
        console.log('Document successfully updated');
        const currentItems = this.itemsSubject.value;
        const index = currentItems.findIndex(i => i.id === item.id);
        if (index !== -1) {
          currentItems[index] = item; // Update the item in the items array
          this.itemsSubject.next(currentItems);  // Update the items subject
        }
      }),
      catchError((error) => {
        console.error('Error updating document: ', error);
        throw error;
      }),
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
