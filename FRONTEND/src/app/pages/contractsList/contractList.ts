import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { AddContractDialogComponent } from "./contractDialog/contractDialog";
import { ContractDTO, ContractService } from "../../services/contractservice";

interface Contract {
  contractcode: string;
  contractholder: string;
  building: string;
  room: string;
  start: string;
  end: string;
  status: string;
}

@Component({
  selector: "app-contract",
  templateUrl: "./contractList.html",
  styleUrls: ["./contractList.css"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatIconModule,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
  ],
})
export class ContractComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ["contractcode", "contractholder", "building", "room", "start", "end", "status"];
  dataSource = new MatTableDataSource<Contract>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchTerm = "";
  buildings: string[] = [];
  statuses: string[] = [];

  filters = {
    building: "",
    room: "",
    status: "",
    startDate: null,
    endDate: null,
  };

  contracts: Contract[] = [];
  filteredcontracts: Contract[] = [];

  constructor(public dialog: MatDialog, private contractService: ContractService) {}

  ngOnInit(): void {
    this.contractService.getAllContracts().subscribe((data: ContractDTO[]) => {
      this.contracts = data.map((item): Contract => ({
        contractcode: item.contractCode,
        contractholder: item.contractHolder,
        building: item.buildingName,
        room: item.roomNumber,
        start: this.formatDate(item.startDate),
        end: this.formatDate(item.endDate),
        status: item.status,
      }));
      this.buildings = Array.from(new Set(this.contracts.map(c => c.building))).filter(b => !!b);
      this.statuses = Array.from(new Set(this.contracts.map(c => c.status))).filter(s => !!s);
      this.applyFilters();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return isNaN(d.getTime()) ? date : `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }

  applyFilters(): void {
    this.filteredcontracts = this.contracts.filter((con) => {
      const searchMatch =
        !this.searchTerm ||
        con.contractcode.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        con.contractholder.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        con.building.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        con.room.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        con.status.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        con.start.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        con.end.toLowerCase().includes(this.searchTerm.toLowerCase());

      const filterMatch =
        (!this.filters.building || con.building === this.filters.building) &&
        (!this.filters.status || con.status === this.filters.status);

      const startDate = this.filters.startDate ? new Date(this.filters.startDate) : null;
      const endDate = this.filters.endDate ? new Date(this.filters.endDate) : null;

      if (startDate) startDate.setHours(0, 0, 0, 0);
      if (endDate) endDate.setHours(23, 59, 59, 999);

      const startParts = con.start.split("/");
      const contractStartDate = new Date(+startParts[2], +startParts[1] - 1, +startParts[0]);

      const endParts = con.end.split("/");
      const contractEndDate = new Date(+endParts[2], +endParts[1] - 1, +endParts[0]);

      const dateMatch = (!startDate || contractStartDate >= startDate) && (!endDate || contractEndDate <= endDate);

      return searchMatch && filterMatch && dateMatch;
    });

    this.dataSource.data = this.filteredcontracts;
    if (this.paginator) this.paginator.firstPage();
  }

  clearFilters(): void {
    this.searchTerm = "";
    this.filters = {
      building: "",
      room: "",
      status: "",
      startDate: null,
      endDate: null,
    };
    this.applyFilters();
  }

  openAddContractDialog(): void {
    const dialogRef = this.dialog.open(AddContractDialogComponent, {
      height: "auto",
      maxHeight: "90vh",
      minWidth: "50vw",
      data: {
        formData: {
          contractcode: "",
          contractholder: "",
          building: "",
          room: null,
          start: "",
          end: "",
          status: "Unsigned",
        },
        buildings: this.buildings,
        contracts: this.contracts,
        statuses: this.statuses,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.contracts.push(result);
        this.applyFilters();
      }
    });
  }

  statusToClass(status: any): string {
    return typeof status === "string" ? "status " + status.toLowerCase() : "status unknown";
  }

  statusToString(status: any): string {
    return typeof status === "string" ? status : "Unknown";
  }
}
