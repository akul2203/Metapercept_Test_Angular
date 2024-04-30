import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ForgetpasswordService } from 'src/app/services/user/forgetpassword.service';
import { LoginService } from 'src/app/services/user/login.service';
import { User } from '../home-navbar.component';
import { UserServiceService } from 'src/app/services/user/user-service.service';
import { Patient } from 'src/app/entity/Patient';
import { DoctorScheduleService } from 'src/app/services/doctor-schedule.service';
import { Doctor_Request } from 'src/app/payload/Request/Doctor_Request';

@Component({
  selector: 'app-profiledialogbox',
  templateUrl: './profiledialogbox.component.html',
  styleUrls: ['./profiledialogbox.component.css']
})
export class ProfiledialogboxComponent implements OnInit {

  role: any;
  status: any;
  user: User = new User;
  patient: Patient = new Patient;
  useremail: any;
  doctor: Doctor_Request = new Doctor_Request;
  constructor(private scheduleservice: DoctorScheduleService, private userservivce: UserServiceService, private cookiesservice: CookieService, private snack: MatSnackBar, private login: LoginService, private router: Router, private forgetpassword: ForgetpasswordService, private fb: FormBuilder) { }
  ngOnInit(): void {
    this.getCurrentUser();
    throw new Error('Method not implemented.');
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
