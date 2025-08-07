import {Component, inject, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Frontend');

  private router = inject(Router);

  onToMainPage() {
    if (confirm('Уйти с текущей страницы?')) {
      this.router.navigate(['/table-of-contents']).then();
    }
  }
}
