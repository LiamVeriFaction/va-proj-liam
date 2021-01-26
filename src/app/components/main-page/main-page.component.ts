import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  

  constructor(private authService : AuthenticationService) { }

  ngOnInit(): void {
    this.authService.login('liam','9ZmvnqK1G4rgPrTCJX').pipe(first()).subscribe();
  }

  getAll(){
    this.authService.getAll().pipe(first()).subscribe((data) => {
      console.log(data);
    });
  }

}
