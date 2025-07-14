import { Component } from '@angular/core';
import { Invoicetable } from "./invoicetable/invoicetable";

@Component({
  selector: 'app-listinvoice',
  imports: [Invoicetable],
  templateUrl: './listinvoice.html',
  styleUrl: './listinvoice.css'
})
export class Listinvoice {

}
