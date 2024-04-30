import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { Doctor } from 'src/app/entity/Doctor';
import { Appointment_Request } from 'src/app/payload/Request/Appointment_Request ';
import { ScheduleRequest } from '../../../payload/Request/ScheduleRequest';
import { LabServiceService } from 'src/app/services/Lab-service/lab-service.service';
import { DoctorScheduleService } from 'src/app/services/doctor-schedule.service';
import { AppointmentserviceService } from 'src/app/services/doctor-service/appointmentservice.service';
import { DoctorserviceService } from 'src/app/services/doctor-service/doctorservice.service';
import Swal from 'sweetalert2';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-dashboard-data',
  templateUrl: './doctor-dashboard-data.component.html',
  styleUrls: ['./doctor-dashboard-data.component.css']
})
export class DoctorDashboardDataComponent implements OnInit {

  getTotalPetient: number = 0;
  doctorId: number = 0;
  ScheduleRequest: ScheduleRequest[] = [];
  ScheduleRequesttoday: ScheduleRequest = new ScheduleRequest;
  todaydate: any;
  dashWidgets = [
    { icon: 'assets/img/icon-01.png', title: 'Total Patient', value: 100, subtitle: 'Till Today', percentage: 75 },
    { icon: 'assets/img/icon-02.png', title: 'Today Patient', value: 160, subtitle: '06, Nov 2019', percentage: 65 },
    { icon: 'assets/img/icon-03.png', title: 'Appointments', value: 85, subtitle: 'ill Today', percentage: 50 }
  ];

  constructor(private route: Router, private scheduleservice: DoctorScheduleService, private labService: LabServiceService, private _doctorService: DoctorserviceService, private appointmentservice: AppointmentserviceService) { }

  IMG_URLs = this.labService.IMAGE_URL;
  upcomingAppointments: Appointment_Request[] = []; // Replace 'any' with your actual data type
  todayAppointments: Appointment_Request[] = []; // Replace 'any' with your actual data type
  doctor: Doctor = new Doctor();
  scheduleForm!: FormGroup;
  ngOnInit() {

    var userString = localStorage.getItem('user');

    if (userString) {
      var user = JSON.parse(userString);
      // console.log(user.email + user.id);
      if (user.id) {
        this.scheduleservice.getdoctorbyuserid(user.id).subscribe((data: any) => {
          this.doctorId = data.doctor.id;
          this.doctor = data;
          console.log("->>>>>>>>>" + this.doctorId);
          this.allappointmentcount(this.doctorId);
          this.getTotalPetientTillToday();
          this.getTodaysTotalpetient();
          this.getTodaysAppointments(this.doctorId);
          this.gettodayschedule(this.doctorId);
        });

      }

    }


  }

  gettodayschedule(drid: any) {

    const today = new Date();

    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = today.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    this.todaydate = formattedDate;

    console.log(drid);

    this.scheduleservice.Dgetschedulesbydoctorid(drid).subscribe((data: any) => {

      this.ScheduleRequest = data;
      console.log(ScheduleRequest);

      this.ScheduleRequesttoday = this.ScheduleRequest[0];
      console.log(this.ScheduleRequesttoday);
      console.log(this.ScheduleRequesttoday.selectedDate);
      console.log("lllllllll");
      console.log(this.todaydate);



      if (this.ScheduleRequesttoday?.selectedDate! <= this.todaydate && this.ScheduleRequesttoday?.selectedDate !== this.todaydate) {
        console.log(this.ScheduleRequesttoday?.selectedDate);
        Swal.fire({
          title: "Do you want to create Schedule Like Last for Today?",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Yes",
          denyButtonText: `!want some changes`
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {

            Swal.fire("Saved!", "", "success");
            this.saveSchedule();
          } else if (result.isDenied) {

            this.route.navigate(['/doctordashboard/doctorscheduletimings']);
          }
        });
      }

    }), (error: any) => {
      Swal.fire('error', 'error at getting today  schedule', 'error')
    }
  }


  saveSchedule() {
    //     const formValues = this.scheduleForm.value;
    // console.log(this.drid + "at save schedule");
    this.ScheduleRequesttoday.id = 0;
    this.ScheduleRequesttoday.selectedDate = this.todaydate;
    console.log("test-------------");

    console.log(this.ScheduleRequesttoday)
    this.ScheduleRequesttoday.timeSlots.forEach(slot => slot.isBooked = false);
    this.scheduleservice.generatetimeslotesandschedule(this.ScheduleRequesttoday).subscribe((data: any) => {
      console.log('Schedule saved successfully!', data);
      Swal.fire(({
        title: "Scheduled",
        text: "Time slotes has been successfully Scheduled",
        icon: "success"
      }));
      //  this.route.navigate(['/doctordashboard/myschedules']);

    }, (error: any) => {
      console.error('Error saving schedule:', error);
    });

  }


  allappointmentcount(doctorid: any) {
    this.appointmentservice.allappointmentcountofdoctorbydrid(doctorid).subscribe(
      (data: any) => {
        // Update the Total Patient value in dashWidgets
        const totalPatientWidget = this.dashWidgets.find(widget => widget.title === 'Appointments');
        if (totalPatientWidget) {
          totalPatientWidget.value = data;
          console.log(data);

        }
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }



  getTodaysAppointments(doctorId: any) {
    this.appointmentservice.gettodayappointmentofdoctor(doctorId).subscribe(
      (data: any) => {
        this.todayAppointments = data;
        console.log(data);
      }
      ,
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }



  getTotalPetientTillToday() {
    this.appointmentservice.totalpatientsofdoctorbydrid(this.doctorId).subscribe(
      (data: any) => {
        // Update the Total Patient value in dashWidgets
        const totalPatientWidget = this.dashWidgets.find(widget => widget.title === 'Total Patient');
        if (totalPatientWidget) {
          totalPatientWidget.value = data;
          console.log(data.TOTAL_PETIENT)
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }


  getTodaysTotalpetient() {
    this.appointmentservice.todaypatientsofdoctorbydrid(this.doctorId).subscribe(
      (data: any) => {
        // Update the Total Patient value in dashWidgets
        const totalPatientWidget = this.dashWidgets.find(widget => widget.title === 'Today Patient');
        if (totalPatientWidget) {
          totalPatientWidget.value = data;
          const todayDate = new Date();
          const day = todayDate.getDate();
          const month = todayDate.toLocaleString('en-US', { month: 'long' });
          const year = todayDate.getFullYear();
          const formattedDate = `${day} ${month} ${year}`;
          totalPatientWidget.subtitle = formattedDate;
          console.log(data.TOTAL_PETIENT)
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }




  cancelAppointment(appointmentId: number): void {
    this._doctorService.cancelAppointment(appointmentId).subscribe(
      response => {
        console.log('Appointment canceled successfully:', response);
        Swal.fire("cancelled", "cancel", "success");
        // Handle the response as needed
      },
      (error: any) => {
        console.error('Error canceling appointment:', error);
        // Handle errors
      }
    );
  }
}
