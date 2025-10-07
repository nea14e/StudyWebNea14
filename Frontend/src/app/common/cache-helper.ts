import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheHelper {
  private values = new Map<string, object>();
  private validUntil = new Map<string, number | null>;

  tryGetValue<T>(key: string) {
    const now = Date.now();
    const until = this.validUntil.get(key);
    if (until === null || (!!until && now < until)) {
      return this.values.get(key) as T;
    } else {
      return null;
    }
  }

  setValue(key: string, value: object, timeoutMs: number) {
    this.values.set(key, value);
    const now = Date.now();
    this.validUntil.set(key, now + timeoutMs);
  }
}
