import { Component } from '@angular/core';
import { NgForm, NgModelGroup } from "@angular/forms";
import { CommonServiceService } from '../app/services/common-service/common-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'API and Scoket';
  model: any = {}
  userMessage: any = [];

  constructor(private studentService: CommonServiceService) { }

  ngOnInit() {
    this.dataSocket();
    this.Getfunction()
  }

  dataSocket() {
    this.studentService.getMessage().subscribe((message: any) => {
      this.userMessage.unshift(message);
      this.Getfunction();
    });
  }


  sendMessage(message: string) {
    this.studentService.sendMessage(message);
  }

  
  onSubmit() {
    this.studentService.postFunction('api/messages', this.model).subscribe(res => {
      if (res.status) {
      }
    })
  }

  // get all user details
  Getfunction() {
    this.studentService.getFunction('api/getmessage').subscribe(res => {
      this.userMessage = res.data;
    })
  }

  // get one user details
  GetOnefunction(_id:any) {
    this.studentService.GetFunction('api/getmessage/',_id).subscribe(res => {
      if(res.status){
        this.userMessage = res.data;
      }else{
        console.log("Data not found");
      }
    })
  }

// update user details
Putfunction(_id: any) {
  this.studentService.putFunction('api/messages/', _id , this.model).subscribe(res => {
    if (res.status) {
      console.log("updated successfull");
    } else {
      console.log("Data not found");
    }
  }
  );
}


Delete(_id: any) {
  this.studentService.postFunction('api/messages/', _id ).subscribe(res => {
    if (res.status) {
      console.log("successfull deleted");
    } else {
      console.log("Data not found");
    }
  }
  );
}




}
