import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontNavbar } from '../../components/front-navbar/front-navbar';

@Component({
  selector: 'app-store-front-layout',
  imports: [RouterOutlet, FrontNavbar],
  templateUrl: './store-front-layout.component.html',
  styleUrls: ['./store-front-layout.component.css'],
})
export class StoreFrontLayoutComponent {

}
