import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/demo/service/data.service';
import * as XLSX from 'xlsx';  // For Excel export
import 'jspdf-autotable';      // For PDF table generation
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-product-demo',
  templateUrl: './producteportdemo.component.html',
})
export class ProductreportDemoComponent implements OnInit {
  process: any[];
  custcodeOption: { name: string; }[];
  filteredcustcodeOptions: { name: string; }[];
  showcustcode: boolean;
  searchcustcode: any;
  custcode: any;
  fgnameOption: { name: string; }[];
  filteredfgnameOptions: { name: string; }[];
  showfgname: any;
  fgname: any;
  searchfgname: any;
  itemOption: { name: string; }[];
  filteredOptions: { name: string; }[];
  searchTerm: string;
  value5: any;
  showItemDialog: any;
   fromDate: Date | null = null;
  toDate: Date | null = null;

  constructor(private dataService: DataService) { }

  ngOnInit() {

  }



  
}
