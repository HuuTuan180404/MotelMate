import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import { FormsModule } from "@angular/forms"

// Angular Material Imports
import { MatRadioModule } from "@angular/material/radio"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"

@Component({
  selector: "app-account-type-selection",
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, MatButtonModule, MatIconModule],
  templateUrl: "./account-type-selection.html",
  styleUrls: ["./account-type-selection.css"],
})
export class AccountTypeSelection {
  selectedAccountType = ""

  constructor(private router: Router) {}

  onNext() {
    if (this.selectedAccountType) {
      if (this.selectedAccountType === "tenant") {
        this.router.navigate(["/register/tenant"])
      } else if (this.selectedAccountType === "landlord") {
        this.router.navigate(["/register/owner"])
      }
    }
  }
}
