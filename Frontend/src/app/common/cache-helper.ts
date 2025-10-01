export class CacheHelper<T> {
  private value: T | null = null;
  private validUntil: number | null = null;

  tryGetValue() {
    const now = Date.now();
    if (!!this.validUntil && now < this.validUntil) {
      console.log('CacheHelper: now:', now, 'используем закешированное значение:', this.value);
      return this.value;
    } else {
      console.log('CacheHelper: now:', now, 'значение устарело или не было установлено');
      return null;
    }
  }

  setValue(value: T, timeoutMs: number) {
    this.value = value;
    const now = Date.now();
    this.validUntil = now + timeoutMs;
    console.log('CacheHelper: now:', now, 'установлено новое значение:', value);
  }
}
