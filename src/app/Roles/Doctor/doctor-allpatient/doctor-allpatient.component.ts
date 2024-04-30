import { Doctor } from 'src/app/entity/Doctor';
import { PatientRequest } from './../../../payload/Request/ParientRequest';
import { Component, OnInit } from '@angular/core';
import { DoctorScheduleService } from 'src/app/services/doctor-schedule.service';
import { AppointmentserviceService } from 'src/app/services/doctor-service/appointmentservice.service';
import { PatientserviceService } from 'src/app/services/patient-service/patientservice.service';

@Component({
  selector: 'app-doctor-allpatient',
  templateUrl: './doctor-allpatient.component.html',
  styleUrls: ['./doctor-allpatient.component.css']
})
export class DoctorAllpatientComponent implements OnInit {
  patients: any[] = []; // Add your patient data here
  patientsList :PatientRequest[]=[];
  constructor(private scheduleservice:DoctorScheduleService,private appointmentService:AppointmentserviceService,private patientservice:PatientserviceService ) { }

  doctor: Doctor = new Doctor();
  doctorId: number = 0;
  ngOnInit(): void {
 this.getDoctor();

    // Fetch or initialize your patient data
    this.patients = [
      {
        name: 'Richard Wilson',
        patientId: 'P0016',
        location: 'Alabama, USA',
        phone: '+1 952 001 8563',
        age: '38 Years, Male',
        bloodGroup: 'AB+',
        image: 'assets/img/patients/patient.jpg'
      },
      {
        name: 'Richard Wilson',
        patientId: 'P0016',
        location: 'Alabama, USA',
        phone: '+1 952 001 8563',
        age: '38 Years, Male',
        bloodGroup: 'AB+',
        image: 'assets/img/patients/patient.jpg'
      },
      {
        name: 'Charlene Reed',
        patientId: 'P0001',
        location: 'North Carolina, USA',
        phone: '+1 828 632 9170',
        age: '29 Years, Female',
        bloodGroup: 'O+',
        image: 'assets/img/patients/patient1.jpg'
      },
      {
        name: 'Travis Trimble',
        patientId: 'PT0002',
        location: 'Maine, USA',
        phone: '+1 207 729 9974',
        age: '23 Years, Male',
        bloodGroup: 'B+',
        image: 'assets/img/patients/patient2.jpg'
      },
      {
        name: 'Harry Williams',
        patientId: 'PT0011',
        location: 'Colorado, USA',
        phone: '+1 303 607 7075',
        age: '9 Years, Male',
        bloodGroup: 'A-',
        image: 'assets/img/patients/patient11.jpg'
      },
      {
        name: 'Robert Rhodes',
        patientId: 'PT0010',
        location: 'California, USA',
        phone: '+1 858 259 5285',
        age: '19 Years, Male',
        bloodGroup: 'B+',
        image: 'assets/img/patients/patient10.jpg'
      },
      // Add other patients here
    ];
  }
  getpatients(drId:any){
    this.patientservice.mypatientsList(drId).subscribe((data:any)=>{
      this.patientsList=data;
      console.log(this.patientsList);
      console.log(data);


    })
  }
  getDoctor(){
    var userString = localStorage.getItem('user');

    if (userString) {
      var user = JSON.parse(userString);
      // console.log(user.email + user.id);
      if (user.id) {
        this.scheduleservice.getdoctorbyuserid(user.id).subscribe((data: any) => {
          this.doctorId = data.doctor.id;
          this.getpatients(this.doctorId);
          console.log("doctor work");

          this.doctor=data;

        });
  }


    }}}
