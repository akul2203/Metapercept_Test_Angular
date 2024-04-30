import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginService } from 'src/app/services/user/login.service';
import { ProfiledialogboxComponent } from './profiledialogbox/profiledialogbox.component';
import { Patient } from 'src/app/entity/Patient';
import { Doctor_Request } from 'src/app/payload/Request/Doctor_Request';
import { UserServiceService } from 'src/app/services/user/user-service.service';
import { DoctorScheduleService } from 'src/app/services/doctor-schedule.service';

@Component({
  selector: 'app-home-navbar',
  templateUrl: './home-navbar.component.html',
  styleUrls: ['./home-navbar.component.css']
})
export class HomeNavbarComponent implements OnInit {

  status: any;
  user: User = new User;
  role:any;
  loginstatus: boolean = false;
  dialogRef: MatDialogRef<ProfiledialogboxComponent> | undefined;
  patient: Patient = new Patient;
  useremail: any;
  doctor: Doctor_Request = new Doctor_Request;

  constructor(private scheduleservice: DoctorScheduleService,  private login: LoginService,private dialog:MatDialog, private userservivce: UserServiceService, private loginservice:LoginService){}


  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialogRef =  this.dialog.open(ProfiledialogboxComponent, {
      width: '300px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
    this.dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');this.\\

      // Perform any action needed after dialog is closed, such as resetting form data
    });
  }


  ngOnInit(): void {

    this.getCurrentUser();
    this.loginservice.getCurrentUser().subscribe((Data:any)=>{
      this.user=Data;

      // console.log(this.user);
      if(this.user){
        this.loginstatus=true;
      }
      const userRole: UserRole | undefined = this.user.userRole[0];
      const role: { roleId: number; roleName: string } | undefined = userRole?.role;
      // Storing 'role' in another variable
      const anotherVariable: { roleId: number; roleName: string } | undefined = role;
      this.role=anotherVariable.roleName;
      //  console.log(this.role=anotherVariable.roleName);
      // console.log(this.role);

    },
    (error:any)=>{
      //error
      console.log("________>>>>>>>>>>>>>>>"+error);
      })

    // throw new Error('Method not implemented.');
  }

  logout(){

  }

  getCurrentUser() {
    this.login.getCurrentUser().subscribe(
      (user: any) => {

        this.user = user;
        this.useremail = user.email;
        this.status = user.status;
        console.log(user);

        //redirect if user : userDashBoard
        if (this.login.getUserRole().includes("ADMIN")) {
          alert('admin')
        }
        else if (this.login.getUserRole().includes("DOCTOR")) {
          // alert('doctor')
          this.role = "DOCTOR"
          if (this.user.id)
            this.getdoctor(this.user.id);
        }

        else if (this.login.getUserRole().includes("LAB")) {
          alert('lab')
        }

        else if (this.login.getUserRole().includes("PATIENT")) {
          this.role = "PATIENT"
          this.getpatient();
        }
      }
    );
  }


  getdoctor(id: any) {
    this.scheduleservice.getdoctorbyuserid(id).subscribe((data: any) => {
      this.doctor = data.doctor;
      console.log(this.doctor);
    });
  }

  getpatient() {
    console.log(this.useremail);

    if (this.useremail)
      this.userservivce.getpatientbyusergmail(this.useremail).subscribe((data: any) => {
        this.patient = data;
        this.patient.id = data.id;
      });
  }


}


export class User {
  id: number=0;
  name: string='';
  email: string='';
  password: string='';
  status: string='';
  role: any; // You can replace 'any' with the actual type of the 'role' property
  userRole: UserRole[] = [];
}

// Define the interface for the 'UserRole' array
interface UserRole {
  role: {
    roleId: number;
    roleName: string;
  };
  userRoleId: number;
}
