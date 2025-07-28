import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AssetModel } from '../../models/Asset.model';
import { AssetService } from '../../services/assetservice';

@Component({
  selector: 'app-assetmanagement',
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
  ],
  templateUrl: './assetmanagement.html',
  styleUrl: './assetmanagement.css',
})
export class AssetManagement {
  _assets: AssetModel[] = [];
  searchText: string = '';

  displayedColumns: string[] = [
    'assetID',
    'name',
    'price',
    'type',
    'description',
    'quantity',
  ];

  constructor(private assetService: AssetService) {}

  ngOnInit(): void {
    this.assetService.getAllAssets().subscribe((data) => {
      this._assets = data.map(
        (x: any): AssetModel => ({
          assetID: x.assetID,
          name: x.name,
          price: x.price,
          type: x.type,
          description: x.description,
          quantity: x.quantity,
        })
      );

      this.dataSource.data = this._assets;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    console.log(this._assets);
  }

  onClick_btnCreate() {
    console.log('create new asset');
  }

  assets: AssetModel[] = [];

  dataSource: MatTableDataSource<AssetModel> = new MatTableDataSource(
    this._assets
  );

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
