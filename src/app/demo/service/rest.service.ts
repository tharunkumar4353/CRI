import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core';

@Injectable()
export class RestService {

    constructor(private http: HttpClient) { }

    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    postBlog(blog: any) {
      let url = "http://localhost:3000/blogs";
      return this.http.put(url, blog, this.httpOptions);
    }

}
