import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/demo/service/data.service';

@Component({
  selector: 'app-product-demo',
  templateUrl: './productdemo.component.html',
})
export class ProductDemoComponent implements OnInit {
  fileList: any[] = [];
  selectedFileId: string | null = null;
  selectedFile: File | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadFileList();
  }

  loadFileList(): void {
    this.dataService.getFileListdemo().subscribe(
      files => this.fileList = files,
      error => console.error('Error fetching file list:', error)
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadFile(): void {
    if (this.selectedFile) {
      this.dataService.uploadFiledemo(this.selectedFile).subscribe(
        response => {
          console.log('File uploaded successfully:', response);
          this.loadFileList();
        },
        error => console.error('Error uploading file:', error)
      );
    } else {
      alert('Please select a file to upload');
    }
  }

  downloadFile(): void {
    if (this.selectedFileId) {
      this.dataService.downloadFiledemo(this.selectedFileId).subscribe(
        response => {
          const base64Data = response.fileContent;
          const filename = response.fileName;

          // Convert base64 to Blob
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/octet-stream' });

          // Create a URL for the Blob
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error => console.error('Error downloading file:', error)
      );
    } else {
      alert('Please select a file to download');
    }
  }
}
