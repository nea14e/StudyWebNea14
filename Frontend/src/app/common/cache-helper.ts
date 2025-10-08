import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheHelper {
  private values = new Map<string, any>();
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

  setValue(key: string, value: any, timeoutMs: number | null) {
    this.values.set(key, value);
    const now = Date.now();
    if (timeoutMs !== null) {
      this.validUntil.set(key, now + timeoutMs);
    } else {
      this.validUntil.set(key, null);
    }
  }
}
